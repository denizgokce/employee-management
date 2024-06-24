import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UserSeederService } from './modules/user/user-seeder.service';
import { EmployeeSeederService } from './modules/employee/employee-seeder.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Initialize and run the UserSeederService to seed user data
  const userSeederService = app.get(UserSeederService);
  await userSeederService.seed();

  // Initialize and run the EmployeeSeederService to seed employee data
  const employeeSeederService = app.get(EmployeeSeederService);
  await employeeSeederService.seed();

  // Enable Cross-Origin Resource Sharing (CORS) for the application
  app.enableCors();

  // Start the NestJS application and listen on the specified port (default: 3015)
  await app.listen(process.env.PORT || 3015);
}

bootstrap()
  .then(() => console.log('Seeding complete')) // Log success message after seeding
  .catch((error) => console.error('Seeding error', error)); // Log error if any during seeding
