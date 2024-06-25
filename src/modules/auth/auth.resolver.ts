import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthPayload } from './auth.payload';
import { Logger, UseGuards } from '@nestjs/common';
import { UserRoleEnum } from './user-role.enum';
import { Roles } from './role.decorator';
import { RolesGuard } from './guards/role.guard';

@Resolver()
export class AuthResolver {
  private readonly logger = new Logger(AuthResolver.name);

  constructor(private readonly authService: AuthService) {}

  /**
   * Mutation resolver for user login operation.
   * @param username The username of the user attempting to log in.
   * @param password The password associated with the provided username.
   * @returns AuthPayload containing access and refresh tokens, username, email, and role.
   */
  @Mutation(() => AuthPayload)
  async login(
    @Args('username') username: string,
    @Args('password') password: string,
  ): Promise<AuthPayload> {
    this.logger.log(`Login attempt for username: ${username}`);
    const authPayload = await this.authService.login(username, password);
    this.logger.log(`Login successful for username: ${username}`);
    return authPayload;
  }

  @Roles(UserRoleEnum.Employee)
  @UseGuards(RolesGuard)
  @Mutation(() => String)
  async test(): Promise<string> {
    return 'test';
  }
}
