import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { BullModule } from '@nestjs/bull';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { EmployeeModule } from './modules/employee/employee.module';
import { EmailModule } from './modules/email/email.module';
import { Employee } from './modules/employee/employee.entity';
import { RequestLoggingMiddleware } from './middlewares/request-logging.middleware';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { User } from './modules/user/user.entity';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';

/**
 * Root module of the NestJS application.
 * Initializes and configures various modules, middleware, and services.
 */
@Module({
  imports: [
    /**
     * Configures environment variables and loads configuration files.
     */
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.development', '.env.production'],
    }),

    /**
     * Handles authentication strategies and JWT tokens.
     */
    PassportModule.register({ defaultStrategy: 'jwt' }),

    /**
     * Configures TypeORM to use SQLite database.
     */
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [Employee, User],
      synchronize: true,
    }),

    /**
     * Configures Bull for handling background jobs with Redis.
     */
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get<string>('BULL_REDIS_HOST'),
          port: configService.get<number>('BULL_REDIS_PORT'),
        },
      }),
      inject: [ConfigService],
    }),

    /**
     * Configures GraphQL API with ApolloDriver and schema file generation.
     */
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),

    /**
     * Imports the EmployeeModule for managing employee-related functionalities.
     */
    EmployeeModule,

    /**
     * Imports the EmailModule for managing email-related functionalities.
     */
    EmailModule,
  ],
  providers: [
    /**
     * Provides JWT service for handling JWT tokens.
     */
    JwtService,

    /**
     * Provides Reflector for handling metadata reflection.
     */
    Reflector,
  ],
})
export class AppModule {
  /**
   * Configures middleware to be applied to all routes.
   * @param consumer Middleware consumer to apply middleware to routes.
   */
  configure(consumer: MiddlewareConsumer) {
    /**
     * Applies RequestLoggingMiddleware to all routes.
     */
    consumer.apply(RequestLoggingMiddleware).forRoutes('*');
  }
}
