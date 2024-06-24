import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { User } from './user.entity';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ConflictException } from '@nestjs/common';
import { UserService } from './user.sevice';

@UseGuards(JwtAuthGuard) // Protects all resolver methods with JwtAuthGuard
@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  /**
   * Query to retrieve all users.
   * @returns Promise<User[]> - Array of all users.
   */
  @Query(() => [User])
  async users(): Promise<User[]> {
    return this.userService.findAll();
  }

  /**
   * Query to retrieve a user by ID.
   * @param id string - ID of the user to retrieve.
   * @returns Promise<User> - The user object if found, otherwise null.
   */
  @Query(() => User)
  async user(@Args('id', { type: () => String }) id: string): Promise<User> {
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
    const existingUser = await this.userService.findByName(username);
    if (existingUser) {
      throw new ConflictException('User with this username already exists');
    }

    const user = new User({ username, email, password, role });
    return this.userService.create(user);
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
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new ConflictException('User does not exist');
    }

    if (username) user.username = username;
    if (email) user.email = email;
    if (role) user.role = role;

    return this.userService.update(id, user);
  }

  /**
   * Mutation to delete an existing user.
   * @param id string - ID of the user to delete.
   * @returns Promise<boolean> - True if deletion is successful.
   * @throws ConflictException if the user does not exist.
   */
  @Mutation(() => Boolean)
  async deleteUser(@Args('id') id: string): Promise<boolean> {
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new ConflictException('User does not exist');
    }

    await this.userService.delete(id);
    return true;
  }
}
