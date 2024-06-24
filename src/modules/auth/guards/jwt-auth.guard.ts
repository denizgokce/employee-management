import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';

/**
 * JwtAuthGuard is a custom authentication guard that extends AuthGuard from '@nestjs/passport'.
 * It is designed specifically for handling JWT-based authentication in GraphQL contexts.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  /**
   * Retrieves the request object (`req`) from the execution context.
   * This method overrides the getRequest method of the AuthGuard class.
   * @param context The execution context containing the request information.
   * @returns The `req` object extracted from the GraphQL context.
   */
  getRequest(context: ExecutionContext) {
    // Convert the ExecutionContext to a GraphQL-specific context
    const gqlContext = GqlExecutionContext.create(context);
    // Retrieve the context object, which contains the request (`req`)
    const graphqlContext = gqlContext.getContext();
    // Return the `req` object from the GraphQL context
    return graphqlContext.req;
  }
}
