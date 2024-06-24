import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { BullModule } from '@nestjs/bull';
import { EmailService } from './email.service';
import { join } from 'lodash';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigModule, ConfigService } from '@nestjs/config';

/**
 * Module for handling email services using NestJS Mailer and Bull queue.
 */
@Module({
  imports: [
    // Setup for NestJS Mailer module
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('MAIL_SERVER_HOST'),
          port: configService.get<number>('MAIL_SERVER_PORT'),
          secure: false,
          auth: {
            user: configService.get<string>('MAIL_SERVER_AUTH_USER'),
            pass: configService.get<string>('MAIL_SERVER_AUTH_PASS'),
          },
        },
        defaults: {
          from: '"No Reply" <no-reply@example.com>',
        },
        template: {
          dir: join(__dirname, 'templates'), // Path to email templates directory
          adapter: new HandlebarsAdapter(), // Template engine adapter (Handlebars in this case)
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
    // Setup for Bull module to manage email processing as jobs
    BullModule.registerQueue({
      name: 'email', // Name of the Bull queue for processing emails
    }),
  ],
  providers: [EmailService], // EmailService provider for handling email-related logic
  exports: [EmailService], // Export EmailService to be used in other modules
})
export class EmailModule {}
