import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { User } from './user.entity';
import { UseGuards, ConflictException, Logger } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserService } from './user.sevice';

@UseGuards(JwtAuthGuard) // Protects all resolver methods with JwtAuthGuard
@Resolver(() => User)
export class UserResolver {
  private readonly logger = new Logger(UserResolver.name);

  constructor(private readonly userService: UserService) {}

  /**
   * Query to retrieve all users.
   * @returns Promise<User[]> - Array of all users.
   */
  @Query(() => [User])
  async users(): Promise<User[]> {
    this.logger.log('Fetching all users');
    return this.userService.findAll();
  }

  /**
   * Query to retrieve a user by ID.
   * @param id string - ID of the user to retrieve.
   * @returns Promise<User> - The user object if found, otherwise null.
   */
  @Query(() => User)
  async user(@Args('id', { type: () => String }) id: string): Promise<User> {
    this.logger.log(`Fetching user with ID: ${id}`);
    return this.userService.findOne(id);
  }

  /**
   * Mutation to create a new user.
   * @param username string - Username of the new user.
   * @param email string - Email of the new user.
   * @param password string - Password of the new user.
   * @param role number - Role of the new user.
   * @returns Promise<User> - The created user object.
   * @throws ConflictException if a user with the same username already exists.
   */
  @Mutation(() => User)
  async createUser(
    @Args('username') username: string,
    @Args('email') email: string,
    @Args('password') password: string,
    @Args('role') role: number,
  ): Promise<User> {
    this.logger.log(`Creating user with username: ${username}`);
    const existingUser = await this.userService.findByName(username);
    if (existingUser) {
      this.logger.warn(`User with username ${username} already exists`);
      throw new ConflictException('User with this username already exists');
    }

    const user = new User({ username, email, password, role });
    const createdUser = await this.userService.create(user);
    this.logger.log(`User created with ID: ${createdUser.id}`);
    return createdUser;
  }

  /**
   * Mutation to update an existing user.
   * @param id string - ID of the user to update.
   * @param username string - New username value (optional).
   * @param email string - New email value (optional).
   * @param role number - New role value (optional).
   * @returns Promise<User> - The updated user object.
   * @throws ConflictException if the user does not exist.
   */
  @Mutation(() => User)
  async updateUser(
    @Args('id') id: string,
    @Args('username') username: string,
    @Args('email') email: string,
    @Args('role') role: number,
  ): Promise<User> {
    this.logger.log(`Updating user with ID: ${id}`);
    const user = await this.userService.findOne(id);
    if (!user) {
      this.logger.warn(`User with ID ${id} does not exist`);
      throw new ConflictException('User does not exist');
    }

    if (username) user.username = username;
    if (email) user.email = email;
    if (role) user.role = role;

    const updatedUser = await this.userService.update(id, user);
    this.logger.log(`User with ID: ${id} updated successfully`);
    return updatedUser;
  }

  /**
   * Mutation to delete an existing user.
   * @param id string - ID of the user to delete.
   * @returns Promise<boolean> - True if deletion is successful.
   * @throws ConflictException if the user does not exist.
   */
  @Mutation(() => Boolean)
  async deleteUser(@Args('id') id: string): Promise<boolean> {
    this.logger.log(`Deleting user with ID: ${id}`);
    const user = await this.userService.findOne(id);
    if (!user) {
      this.logger.warn(`User with ID ${id} does not exist`);
      throw new ConflictException('User does not exist');
    }

    await this.userService.delete(id);
    this.logger.log(`User with ID: ${id} deleted successfully`);
    return true;
  }
}
