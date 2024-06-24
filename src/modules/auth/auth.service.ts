/**
 * Service responsible for authentication-related operations.
 */
import { Injectable, Logger } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.sevice';
import { User } from '../user/user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private nestJwtService: NestJwtService,
    private usersService: UserService,
    private configService: ConfigService,
  ) {}

  /**
   * Validates a user based on the provided userId.
   * @param userId The ID of the user to validate.
   * @returns The user object if found, otherwise null.
   */
  async validateUser(userId: string): Promise<User | null> {
    this.logger.log(`Validating user with ID: ${userId}`);
    const user = await this.usersService.findOne(userId);
    if (!user) {
      this.logger.warn(`User with ID ${userId} not found`);
    }
    return user;
  }

  /**
   * Authenticates a user based on username and optional password.
   * @param username The username of the user to authenticate.
   * @param password (Optional) The password associated with the username.
   * @returns An object containing access_token, refresh_token, username, email, and role upon successful login.
   * @throws Error if the user is not found or if the password is incorrect.
   */
  async login(username: string, password?: string): Promise<any> {
    this.logger.log(`Attempting login for username: ${username}`);
    const user: User = await this.usersService.findByName(username);

    if (!user) {
      this.logger.error(`User not found: ${username}`);
      throw new Error('User not found');
    }

    if (password) {
      this.logger.log(`Validating password for username: ${username}`);
      const passwordValid = await bcrypt.compare(password, user.password);
      if (!passwordValid) {
        this.logger.error(`Incorrect password for username: ${username}`);
        throw new Error('Incorrect password');
      }
    }

    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    this.logger.log(`Login successful for username: ${username}`);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      username: user.username,
      email: user.email,
      role: user.role,
    };
  }

  /**
   * Generates an access token for a user.
   * @param user The user object for whom the token is generated.
   * @returns The generated access token.
   */
  private generateAccessToken(user: User): string {
    this.logger.log(`Generating access token for user: ${user.username}`);
    const payload = {
      sub: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };
    return this.nestJwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
    });
  }

  /**
   * Generates a refresh token for a user.
   * @param user The user object for whom the token is generated.
   * @returns The generated refresh token.
   */
  private generateRefreshToken(user: User): string {
    this.logger.log(`Generating refresh token for user: ${user.username}`);
    const refreshToken = bcrypt.hashSync(user.username + Date.now(), 10);
    return refreshToken;
  }
}
