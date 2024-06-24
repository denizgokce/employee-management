import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Employee } from './employee.entity';
import { EmailService } from '../email/email.service';
import { IWrite } from '../../interfaces/IWrite';
import { IRead } from '../../interfaces/IRead';
import * as _ from 'lodash';

@Injectable()
export class EmployeeService implements IWrite<Employee>, IRead<Employee> {
  constructor(
    @InjectRepository(Employee)
    private employeesRepository: Repository<Employee>,
    private emailService: EmailService,
  ) {}

  /**
   * Creates a new employee record.
   * @param employee Partial<Employee> - The employee data to be created.
   * @returns Promise<Employee> - The created employee object.
   */
  async create(employee: Partial<Employee>): Promise<Employee> {
    const newEmployee = this.employeesRepository.create(employee);
    const savedEmployee = await this.employeesRepository.save(newEmployee);
    await this.emailService.sendWelcomeEmail(savedEmployee.email);
    return savedEmployee;
  }

  /**
   * Retrieves all employees from the database.
   * @returns Promise<Employee[]> - Array of all employees.
   */
  async findAll(): Promise<Employee[]> {
    return this.employeesRepository.find();
  }

  /**
   * Retrieves an employee by ID.
   * @param id string - The ID of the employee to retrieve.
   * @returns Promise<Employee> - The employee object if found, otherwise undefined.
   */
  async findOne(id: string): Promise<Employee> {
    return this.employeesRepository.findOne({ where: { id } });
  }

  /**
   * Updates an employee record.
   * @param id string - The ID of the employee to update.
   * @param updateData Partial<Employee> - The partial data to update.
   * @returns Promise<Employee> - The updated employee object.
   */
  async update(id: string, updateData: Partial<Employee>): Promise<Employee> {
    await this.employeesRepository.update(id, updateData);
    return this.employeesRepository.findOne({ where: { id } });
  }

  /**
   * Removes an employee record from the database.
   * @param id string - The ID of the employee to remove.
   * @returns Promise<void>
   */
  async delete(id: string): Promise<void> {
    await this.employeesRepository.delete(id);
  }

  /**
   * Counts the total number of employees.
   * @returns Promise<number> - The total number of employees.
   */
  async count(): Promise<number> {
    return this.employeesRepository.count();
  }

  /**
   * Queries employees based on provided criteria.
   * @param query FindOptionsWhere<Employee> - The query criteria.
   * @returns Promise<Employee[]> - Array of employees matching the query criteria.
   */
  async query(query: FindOptionsWhere<Employee>): Promise<Employee[]> {
    return this.employeesRepository.find({ where: query });
  }

  /**
   * Checks if an item with the given id exists.   *
   * @param {string} id - The id of the item to check.
   * @return {Promise<boolean>} A promise that resolves to `true` if an item with the given id exists,
   *         otherwise resolves to `false`.
   */
  async isExist(id: string): Promise<boolean> {
    const existing = await this.findOne(id);
    return !_.isNil(existing);
  }
}
