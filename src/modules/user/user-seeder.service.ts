import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { UserRoleEnum } from '../auth/user-role.enum';

@Injectable()
export class UserSeederService {
  private readonly logger = new Logger(UserSeederService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Seeds initial users into the database if they do not already exist.
   */
  async seed() {
    this.logger.log('Seeding initial users...');

    const users: User[] = [
      new User({
        username: 'admin',
        email: 'admin@admin.com',
        password: await bcrypt.hash('Test1234?', 10),
        role: UserRoleEnum.Admin,
      }),
      new User({
        username: 'systemAdmin',
        email: 'systemAdmin@systemAdmin.com',
        password: await bcrypt.hash('Test1234?', 10),
        role: UserRoleEnum.SystemAdmin,
      }),
      new User({
        username: 'payrollAccountManager',
        email: 'payrollAccountManager@payrollAccountManager.com',
        password: await bcrypt.hash('Test1234?', 10),
        role: UserRoleEnum.PayrollAccountManager,
      }),
      new User({
        username: 'companyHR',
        email: 'companyHR@companyHR.com',
        password: await bcrypt.hash('Test1234?', 10),
        role: UserRoleEnum.CompanyHR,
      }),
      new User({
        username: 'employee',
        email: 'employee@employee.com',
        password: await bcrypt.hash('Test1234?', 10),
        role: UserRoleEnum.Employee,
      }),
    ];

    for (const user of users) {
      const existingUser = await this.userRepository.findOne({
        where: { email: user.email },
      });
      if (!existingUser) {
        try {
          await this.userRepository.save(user);
          this.logger.log(`Created user ${user.username} (${user.email})`);
        } catch (error) {
          this.logger.error(
            `Failed to create user ${user.username} (${user.email}): ${error.message}`,
          );
        }
      } else {
        this.logger.warn(
          `User ${user.username} (${user.email}) already exists`,
        );
      }
    }

    this.logger.log('User seeding completed.');
  }
}
