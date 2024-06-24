import { ObjectType, Field } from '@nestjs/graphql';

/**
 * Represents the authentication payload returned to clients.
 * This payload includes access and refresh tokens, along with user details.
 */
@ObjectType()
export class AuthPayload {
  /**
   * JWT access token for authentication.
   */
  @Field()
  access_token: string;

  /**
   * JWT refresh token for token renewal.
   */
  @Field()
  refresh_token: string;

  /**
   * Username of the authenticated user.
   */
  @Field()
  username: string;

  /**
   * Email address of the authenticated user.
   */
  @Field()
  email: string;

  /**
   * Role identifier of the authenticated user.
   */
  @Field()
  role: number;
}
