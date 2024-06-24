import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { EmailService } from './email.service';
import { Logger } from '@nestjs/common';

/**
 * Processor class for handling email jobs using Bull queue.
 * Processes jobs related to email functionalities.
 */
@Processor('email')
export class EmailProcessor {
  private readonly logger = new Logger(EmailProcessor.name);

  constructor(private readonly emailService: EmailService) {}

  /**
   * Handles the 'sendWelcomeEmail' job from the Bull queue.
   * Delegates the processing to the EmailService for sending welcome emails.
   * @param job - The Bull job containing data for sending a welcome email.
   */
  @Process('sendWelcomeEmail')
  async handleSendWelcomeEmail(job: Job) {
    this.logger.log(
      `Processing job ${job.id} - Sending welcome email to ${job.data.email}`,
    );
    try {
      await this.emailService.processEmail(job);
      this.logger.log(
        `Job ${job.id} - Welcome email sent successfully to ${job.data.email}`,
      );
    } catch (error) {
      this.logger.error(
        `Job ${job.id} - Failed to send welcome email to ${job.data.email}`,
        error.stack,
      );
    }
  }
}
