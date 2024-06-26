import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { EmployeeService } from './employee.service';
import { Employee } from './employee.entity';
import { ConflictException, Logger, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import * as _ from 'lodash';

@UseGuards(JwtAuthGuard)
@Resolver(() => Employee)
export class EmployeeResolver {
  private readonly logger = new Logger(EmployeeResolver.name);

  constructor(private readonly employeeService: EmployeeService) {}

  /**
   * Resolver method to fetch all employees.
   * Requires JWT authentication.
   * @returns {Promise<Employee[]>} List of all employees.
   */
  @Query(() => [Employee])
  async employees(): Promise<Employee[]> {
    this.logger.log('Fetching all employees');
    return this.employeeService.findAll();
  }

  /**
   * Resolver method to fetch a single employee by ID.
   * Requires JWT authentication.
   * @param {string} id - ID of the employee to fetch.
   * @returns {Promise<Employee>} The employee with the specified ID.
   */
  @Query(() => Employee)
  async employee(
    @Args('id', { type: () => String }) id: string,
  ): Promise<Employee> {
    this.logger.log(`Fetching employee with ID: ${id}`);
    return this.employeeService.findOne(id);
  }

  /**
   * Resolver method to create a new employee.
   * Requires JWT authentication.
   * @param {string} name - Name of the new employee.
   * @param {string} email - Email of the new employee.
   * @param {string} jobTitle - Job title of the new employee.
   * @param {string} department - Department of the new employee.
   * @returns {Promise<Employee>} The created employee.
   * @throws {ConflictException} If an employee with the same email already exists.
   */
  @Mutation(() => Employee)
  async createEmployee(
    @Args('name') name: string,
    @Args('email') email: string,
    @Args('jobTitle') jobTitle: string,
    @Args('department') department: string,
  ): Promise<Employee> {
    this.logger.log(`Creating employee with email: ${email}`);
    const existingEmployees = await this.employeeService.query({ email });
    if (existingEmployees.length > 0) {
      this.logger.warn(`Employee with email ${email} already exists`);
      throw new ConflictException('Employee with this email already exists');
    }
    const employee = new Employee({ name, email, jobTitle, department });
    this.logger.log(`Employee created with email: ${email}`);
    return this.employeeService.create(employee);
  }

  /**
   * Resolver method to update an existing employee.
   * Requires JWT authentication.
   * @param {string} id - ID of the employee to update.
   * @param {string} name - Updated name of the employee.
   * @param {string} email - Updated email of the employee.
   * @param {string} jobTitle - Updated job title of the employee.
   * @param {string} department - Updated department of the employee.
   * @returns {Promise<Employee>} The updated employee.
   * @throws {ConflictException} If the employee with the specified ID does not exist.
   */
  @Mutation(() => Employee)
  async updateEmployee(
    @Args('id') id: string,
    @Args('name') name: string,
    @Args('email') email: string,
    @Args('jobTitle') jobTitle: string,
    @Args('department') department: string,
  ): Promise<Employee> {
    this.logger.log(`Updating employee with ID: ${id}`);
    const employee = await this.employeeService.findOne(id);
    if (_.isNil(employee)) {
      this.logger.warn(`Employee with ID ${id} does not exist`);
      throw new ConflictException('Employee does not exist');
    }
    if (name) employee.name = name;
    if (email) employee.email = email;
    if (jobTitle) employee.jobTitle = jobTitle;
    if (department) employee.department = department;
    this.logger.log(`Employee with ID ${id} updated`);
    return this.employeeService.update(id, employee);
  }

  /**
   * Resolver method to delete an employee by ID.
   * Requires JWT authentication.
   * @param {string} id - ID of the employee to delete.
   * @returns {Promise<boolean>} True if deletion was successful.
   * @throws {ConflictException} If the employee with the specified ID does not exist.
   */
  @Mutation(() => Boolean)
  async deleteEmployee(@Args('id') id: string): Promise<boolean> {
    this.logger.log(`Deleting employee with ID: ${id}`);
    const existingEmployee = await this.employeeService.findOne(id);
    if (_.isNil(existingEmployee)) {
      this.logger.warn(`Employee with ID ${id} does not exist`);
      throw new ConflictException('Employee does not exist');
    }
    await this.employeeService.delete(id);
    this.logger.log(`Employee with ID ${id} deleted`);
    return true;
  }
}
