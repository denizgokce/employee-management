import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserSeederService } from './user-seeder.service';
import { UserResolver } from './user.resolver';
import { UserService } from './user.sevice';

/**
 * Module for managing users.
 * Imports TypeOrmModule for database integration with the User entity.
 * Provides UserService for business logic, UserSeederService for data seeding,
 * and UserResolver for GraphQL query and mutation handling.
 */
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService, UserSeederService, UserResolver],
  exports: [UserSeederService, UserService], // Export services for dependency injection
})
export class UserModule {}
