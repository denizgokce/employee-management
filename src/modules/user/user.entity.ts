import { ObjectType, Field, ID } from '@nestjs/graphql';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';

/**
 * User entity represents a user in the application.
 */
@ObjectType()
@Entity()
export class User {
  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }

  /**
   * The ID of the user.
   */
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * The username of the user.
   */
  @Field()
  @Column({ type: 'text', nullable: false })
  username: string;

  /**
   * The email address of the user.
   */
  @Field()
  @Column({ type: 'text', nullable: false })
  email: string;

  /**
   * The password of the user.
   * This should be hashed and never exposed in plain text.
   */
  @Field()
  @Column({ type: 'text', nullable: false })
  password: string;

  /**
   * The role of the user.
   * Represents the user's role in the application.
   */
  @Field()
  @Column({ type: 'integer', nullable: false })
  role: number;

  /**
   * The timestamp when the user was created.
   */
  @Field()
  @CreateDateColumn({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
  })
  created: Date;

  /**
   * The timestamp when the user was last updated.
   */
  @Field()
  @UpdateDateColumn({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
  })
  updated: Date;
}
