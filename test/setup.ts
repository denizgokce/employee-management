import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

export const setupTestApp = async (): Promise<INestApplication> => {
  const moduleFixture = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication();
  await app.init();
  return app;
};

export const generateTestToken = (payload: object): string => {
  const jwtService = new JwtService({
    secret: new ConfigService().get<string>('JWT_SECRET'),
    signOptions: { expiresIn: '1h' },
  });

  return jwtService.sign(payload);
};
