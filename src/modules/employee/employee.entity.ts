import { ObjectType, Field, ID } from '@nestjs/graphql';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';
import { faker } from '@faker-js/faker';

/**
 * Represents an Employee entity.
 */
@ObjectType()
@Entity()
export class Employee {
  /**
   * Constructs an instance of Employee.
   * @param partial - Optional data to initialize the Employee object.
   */
  constructor(partial: Partial<Employee>) {
    Object.assign(this, partial);
  }

  /** The unique identifier of the employee. */
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** The name of the employee. */
  @Field()
  @Column({ type: 'text', nullable: false })
  name: string;

  /** The email address of the employee. */
  @Field()
  @Column({ type: 'text', nullable: false })
  email: string;

  /** The job title of the employee. */
  @Field()
  @Column({ type: 'text', nullable: false })
  jobTitle: string;

  /** The department of the employee. */
  @Field()
  @Column({ type: 'text', nullable: false })
  department: string;

  /** The date and time when the employee was created. */
  @Field()
  @CreateDateColumn({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
  })
  created: Date;

  /** The date and time when the employee was last updated. */
  @Field()
  @UpdateDateColumn({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
  })
  updated: Date;

  /**
   * Generates a fake Employee object with random data.
   * @returns A new Employee instance populated with fake data.
   */
  static fakeEmployee(): Employee {
    return new Employee({
      name: faker.name.fullName(),
      email: faker.internet.email(),
      jobTitle: faker.name.jobTitle(),
      department: faker.commerce.department(),
      created: new Date(),
      updated: new Date(),
    });
  }
}
