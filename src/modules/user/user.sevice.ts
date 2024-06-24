import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { User } from './user.entity';
import { IWrite } from '../../interfaces/IWrite';
import { IRead } from '../../interfaces/IRead';
import * as _ from 'lodash';

@Injectable()
export class UserService implements IWrite<User>, IRead<User> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Creates a new user record.
   * @param user Partial<User> - The user data to be created.
   * @returns Promise<User> - The created user object.
   */
  async create(user: Partial<User>): Promise<User> {
    const newUser = this.userRepository.create(user);
    const savedUser = await this.userRepository.save(newUser);
    return savedUser;
  }

  /**
   * Retrieves all users from the database.
   * @returns Promise<User[]> - Array of all users.
   */
  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  /**
   * Retrieves a user by ID.
   * @param id string - The ID of the user to retrieve.
   * @returns Promise<User> - The user object if found, otherwise throws NotFoundException.
   * @throws NotFoundException if no user with the specified ID is found.
   */
  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  /**
   * Updates a user record.
   * @param id string - The ID of the user to update.
   * @param updateData Partial<User> - The partial data to update.
   * @returns Promise<User> - The updated user object.
   * @throws NotFoundException if no user with the specified ID is found after update.
   */
  async update(id: string, updateData: Partial<User>): Promise<User> {
    await this.userRepository.update(id, updateData);
    const updatedUser = await this.findOne(id);
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return updatedUser;
  }

  /**
   * Deletes a user record from the database.
   * @param id string - The ID of the user to delete.
   * @returns Promise<void>
   * @throws NotFoundException if no user with the specified ID is found.
   */
  async delete(id: string): Promise<void> {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    await this.userRepository.delete(id);
  }

  /**
   * Finds a user by username.
   * @param name string - The username to search for.
   * @returns Promise<User | null> - The user object if found, otherwise null.
   */
  async findByName(name: string): Promise<User | null> {
    const users: User[] = await this.userRepository
      .createQueryBuilder('user')
      .where('user.username = :name', { name })
      .getMany();
    return users.length > 0 ? users[0] : null;
  }

  /**
   * Retrieves the number of users in the repository.
   * @returns {Promise<number>} A Promise that resolves to the number of users.
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
   * @return {Promise<User[]>} - A promise that resolves with an array of users found.
   */
  async query(query: FindOptionsWhere<User>): Promise<User[]> {
    return this.userRepository.find({ where: query });
  }
}
