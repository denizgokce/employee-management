import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './employee.entity';
import * as _ from 'lodash';

@Injectable()
export class EmployeeSeederService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) {}

  /**
   * Seeds fake employee data into the database if no employees exist.
   */
  async seed() {
    // Count the number of existing employees
    const employeeCount = await this.employeeRepository.count();

    // If no employees exist, seed fake employees
    if (employeeCount <= 0) {
      // Generate 10 fake employees using Employee.fakeEmployee() method
      const fakeEmployees = _.range(10).map(() => Employee.fakeEmployee());

      // Save each fake employee to the database
      for (const employee of fakeEmployees) {
        await this.employeeRepository.save(employee);
      }
    }
  }
}
