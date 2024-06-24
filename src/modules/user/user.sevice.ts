import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { User } from './user.entity';
import { IWrite } from '../../interfaces/IWrite';
import { IRead } from '../../interfaces/IRead';
import * as _ from 'lodash';

@Injectable()
export class UserService implements IWrite<User>, IRead<User> {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Creates a new user record.
   * @param {Partial<User>} user - The user data to be created.
   * @returns {Promise<User>} - The created user object.
   */
  async create(user: Partial<User>): Promise<User> {
    const newUser = this.userRepository.create(user);
    const savedUser = await this.userRepository.save(newUser);
    this.logger.log(`Created user with ID: ${savedUser.id}`);
    return savedUser;
  }

  /**
   * Retrieves all users from the database.
   * @returns {Promise<User[]>} - Array of all users.
   */
  async findAll(): Promise<User[]> {
    this.logger.log('Fetching all users');
    return this.userRepository.find();
  }

  /**
   * Retrieves a user by ID.
   * @param {string} id - The ID of the user to retrieve.
   * @returns {Promise<User>} - The user object if found, otherwise throws NotFoundException.
   * @throws {NotFoundException} if no user with the specified ID is found.
   */
  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      this.logger.warn(`User with ID ${id} not found`);
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  /**
   * Updates a user record.
   * @param {string} id - The ID of the user to update.
   * @param {Partial<User>} updateData - The partial data to update.
   * @returns {Promise<User>} - The updated user object.
   * @throws {NotFoundException} if no user with the specified ID is found after update.
   */
  async update(id: string, updateData: Partial<User>): Promise<User> {
    await this.userRepository.update(id, updateData);
    const updatedUser = await this.findOne(id);
    if (!updatedUser) {
      this.logger.warn(`User with ID ${id} not found after update`);
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    this.logger.log(`Updated user with ID: ${id}`);
    return updatedUser;
  }

  /**
   * Deletes a user record from the database.
   * @param {string} id - The ID of the user to delete.
   * @returns {Promise<void>}
   * @throws {NotFoundException} if no user with the specified ID is found.
   */
  async delete(id: string): Promise<void> {
    const user = await this.findOne(id);
    if (!user) {
      this.logger.warn(`User with ID ${id} not found`);
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    await this.userRepository.delete(id);
    this.logger.log(`Deleted user with ID: ${id}`);
  }

  /**
   * Finds a user by username.
   * @param {string} name - The username to search for.
   * @returns {Promise<User | null>} - The user object if found, otherwise null.
   */
  async findByName(name: string): Promise<User | null> {
    const users: User[] = await this.userRepository
      .createQueryBuilder('user')
      .where('user.username = :name', { name })
      .getMany();
    const user = users.length > 0 ? users[0] : null;
    if (user) {
      this.logger.log(`Found user with username: ${name}`);
    } else {
      this.logger.warn(`User with username ${name} not found`);
    }
    return user;
  }

  /**
   * Retrieves the number of users in the repository.
   * @returns {Promise<number>} - A Promise that resolves to the number of users.
   */
  async count(): Promise<number> {
    return this.userRepository.count();
  }

  /**
   * Checks if an entity with the given ID exists.
   * @param {string} id - The ID of the entity to check for existence.
   * @returns {Promise<boolean>} - A promise that resolves to a boolean indicating whether the entity exists or not.
   */
  async isExist(id: string): Promise<boolean> {
    const existing = await this.findOne(id);
    return !_.isNil(existing);
  }

  /**
   * Executes a query to find users in the database.
   * @param {FindOptionsWhere<User>} query - The query options to filter the users.
   * @returns {Promise<User[]>} - A promise that resolves with an array of users found.
   */
  async query(query: FindOptionsWhere<User>): Promise<User[]> {
    return this.userRepository.find({ where: query });
  }
}
