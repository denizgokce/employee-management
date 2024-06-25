import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Employee } from './employee.entity';
import { EmailService } from '../email/email.service';
import { IWrite } from '../../interfaces/IWrite';
import { IRead } from '../../interfaces/IRead';
import * as _ from 'lodash';

@Injectable()
export class EmployeeService implements IWrite<Employee>, IRead<Employee> {
  private readonly logger = new Logger(EmployeeService.name);

  constructor(
    @InjectRepository(Employee)
    private readonly employeesRepository: Repository<Employee>,
    private readonly emailService: EmailService,
  ) {}

  /**
   * Creates a new employee record.
   * @param employee Partial<Employee> - The employee data to be created.
   * @returns Promise<Employee> - The created employee object.
   */
  async create(employee: Partial<Employee>): Promise<Employee> {
    this.logger.log(`Creating a new employee: ${JSON.stringify(employee)}`);
    const newEmployee = this.employeesRepository.create(employee);
    const savedEmployee = await this.employeesRepository.save(newEmployee);
    await this.emailService.sendWelcomeEmail(savedEmployee.email);
    this.logger.log(`Created new employee with ID: ${savedEmployee.id}`);
    return savedEmployee;
  }

  /**
   * Retrieves all employees from the database.
   * @returns Promise<Employee[]> - Array of all employees.
   */
  async findAll(): Promise<Employee[]> {
    this.logger.log('Fetching all employees');
    return this.employeesRepository.find();
  }

  /**
   * Retrieves an employee by ID.
   * @param id string - The ID of the employee to retrieve.
   * @returns Promise<Employee> - The employee object if found, otherwise undefined.
   */
  async findOne(id: string): Promise<Employee> {
    this.logger.log(`Fetching employee with ID: ${id}`);
    return this.employeesRepository.findOne({ where: { id } });
  }

  /**
   * Updates an employee record.
   * @param id string - The ID of the employee to update.
   * @param updateData Partial<Employee> - The partial data to update.
   * @returns Promise<Employee> - The updated employee object.
   */
  async update(id: string, updateData: Partial<Employee>): Promise<Employee> {
    this.logger.log(
      `Updating employee with ID: ${id} with data: ${JSON.stringify(updateData)}`,
    );
    await this.employeesRepository.update(id, updateData);
    const updatedEmployee = await this.employeesRepository.findOne({
      where: { id },
    });
    this.logger.log(`Updated employee with ID: ${id}`);
    return updatedEmployee;
  }

  /**
   * Removes an employee record from the database.
   * @param id string - The ID of the employee to remove.
   * @returns Promise<void>
   */
  async delete(id: string): Promise<void> {
    this.logger.log(`Deleting employee with ID: ${id}`);
    await this.employeesRepository.delete(id);
    this.logger.log(`Deleted employee with ID: ${id}`);
  }

  /**
   * Counts the total number of employees.
   * @returns Promise<number> - The total number of employees.
   */
  async count(): Promise<number> {
    this.logger.log('Counting total number of employees');
    return this.employeesRepository.count();
  }

  /**
   * Queries employees based on provided criteria.
   * @param query FindOptionsWhere<Employee> - The query criteria.
   * @returns Promise<Employee[]> - Array of employees matching the query criteria.
   */
  async query(query: FindOptionsWhere<Employee>): Promise<Employee[]> {
    this.logger.log(
      `Querying employees with criteria: ${JSON.stringify(query)}`,
    );
    return this.employeesRepository.find({ where: query });
  }

  /**
   * Checks if an item with the given id exists.
   * @param {string} id - The id of the item to check.
   * @return {Promise<boolean>} A promise that resolves to `true` if an item with the given id exists,
   *         otherwise resolves to `false`.
   */
  async isExist(id: string): Promise<boolean> {
    this.logger.log(`Checking existence of employee with ID: ${id}`);
    const existing = await this.findOne(id);
    const exists = !_.isNil(existing);
    this.logger.log(`Employee with ID: ${id} exists: ${exists}`);
    return exists;
  }
}
