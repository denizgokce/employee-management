import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { EmailService } from './email.service';

/**
 * Processor class for handling email jobs using Bull queue.
 * Processes jobs related to email functionalities.
 */
@Processor('email')
export class EmailProcessor {
  constructor(private readonly emailService: EmailService) {}

  /**
   * Handles the 'sendWelcomeEmail' job from the Bull queue.
   * Delegates the processing to the EmailService for sending welcome emails.
   * @param job - The Bull job containing data for sending a welcome email.
   */
  @Process('sendWelcomeEmail')
  async handleSendWelcomeEmail(job: Job) {
    await this.emailService.processEmail(job);
  }
}
