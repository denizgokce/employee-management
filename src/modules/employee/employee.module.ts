import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from './employee.entity';
import { EmployeeService } from './employee.service';
import { EmployeeResolver } from './employee.resolver';
import { EmailModule } from '../email/email.module';
import { AuthModule } from '../auth/auth.module';
import { EmployeeSeederService } from './employee-seeder.service';

/**
 * Employee module that encapsulates all functionality related to employees.
 * It imports TypeORM for database integration, EmailModule for sending emails,
 * and AuthModule for authentication and authorization.
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([Employee]), // Import TypeORM module for Employee entity
    EmailModule, // Import EmailModule for email sending functionality
    AuthModule, // Import AuthModule for authentication and authorization
  ],
  providers: [
    EmployeeService, // Provide EmployeeService for business logic related to employees
    EmployeeResolver, // Provide EmployeeResolver for GraphQL queries and mutations
    EmployeeSeederService, // Provide EmployeeSeederService for seeding employee data
  ],
  exports: [
    EmployeeService, // Export EmployeeService to be used by other modules
    EmployeeSeederService, // Export EmployeeSeederService to be used by other modules
  ],
})
export class EmployeeModule {}
