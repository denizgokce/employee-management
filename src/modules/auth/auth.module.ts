import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport'; // Import JwtAuthGuard

/**
 * Module for handling authentication using JWT tokens.
 *
 * Imports:
 * - ConfigModule: Loads environment variables.
 * - PassportModule: Registers Passport with 'jwt' as the default strategy.
 * - JwtModule: Provides JWT token generation and verification.
 * - UserModule: Module containing user-related entities and services.
 *
 * Providers:
 * - AuthService: Service for authentication logic (login, token generation).
 * - AuthResolver: GraphQL resolver for authentication-related queries and mutations.
 * - JwtStrategy: Passport strategy for JWT authentication.
 * - JwtAuthGuard: Guard to protect routes using JWT authentication.
 *
 * Exports:
 * - AuthService: Available for injection into other modules.
 * - JwtAuthGuard: Protects routes in other modules using JWT authentication.
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.development', '.env.production'],
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRATION'),
        },
      }),
      inject: [ConfigService],
    }),
    UserModule, // Ensure UserModule is imported if needed
  ],
  providers: [AuthService, AuthResolver, JwtStrategy, JwtAuthGuard],
  exports: [AuthService, JwtAuthGuard],
})
export class AuthModule {}
