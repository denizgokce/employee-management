import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './employee.entity';
import * as _ from 'lodash';

@Injectable()
export class EmployeeSeederService {
  private readonly logger = new Logger(EmployeeSeederService.name);

  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) {}

  /**
   * Seeds fake employee data into the database if no employees exist.
   */
  async seed() {
    this.logger.log('Starting employee seeding process');

    // Count the number of existing employees
    const employeeCount = await this.employeeRepository.count();
    this.logger.log(`Found ${employeeCount} existing employees`);

    // If no employees exist, seed fake employees
    if (employeeCount <= 0) {
      this.logger.log('No existing employees found, seeding fake employees');

      // Generate 10 fake employees using Employee.fakeEmployee() method
      const fakeEmployees = _.range(10).map(() => Employee.fakeEmployee());

      // Save each fake employee to the database
      for (const employee of fakeEmployees) {
        await this.employeeRepository.save(employee);
        this.logger.log(`Seeded employee: ${JSON.stringify(employee)}`);
      }

      this.logger.log('Seeding process completed');
    } else {
      this.logger.log('Employees already exist, skipping seeding process');
    }
  }
}
