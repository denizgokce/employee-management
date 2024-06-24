/**
 * Resolver for handling authentication-related GraphQL mutations.
 */
import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthPayload } from './auth.payload';

@Resolver()
export class AuthResolver {
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
    return this.authService.login(username, password);
  }
}
