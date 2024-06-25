import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { setupTestApp, generateTestToken } from './setup';
import { UserRoleEnum } from '../src/modules/auth/user-role.enum';

describe('GraphQL (e2e)', () => {
  let app: INestApplication;
  let token: string;

  beforeAll(async () => {
    app = await setupTestApp();
    token = generateTestToken({
      username: 'admin',
      email: 'admin@admin.com',
      sub: 'b4434b42-1772-4f2c-b2aa-93be99d7fa1e',
      role: UserRoleEnum.Admin,
    });
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return a list of users', () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `
          query {
            users {
              id
              username
              email
              role
            }
          }
        `,
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.data.users).toBeDefined();
        expect(res.body.data.users.length).toBeGreaterThan(0);
      });
  });

  it('should create a new user', () => {
    const newUser = {
      username: 'newuser',
      email: 'newuser@example.com',
      password: 'Test1234?',
      role: UserRoleEnum.Employee, // Assuming Employee is a valid role
    };

    return request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `
          mutation {
            createUser(username: "${newUser.username}", email: "${newUser.email}", password: "${newUser.password}", role: ${newUser.role}) {
              id
              username
              email
              role
            }
          }
        `,
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.data.createUser).toBeDefined();
        expect(res.body.data.createUser.username).toBe(newUser.username);
        expect(res.body.data.createUser.email).toBe(newUser.email);
        expect(res.body.data.createUser.role).toBe(newUser.role);
      });
  });
});
