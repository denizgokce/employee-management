import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { InjectQueue } from '@nestjs/bull';
import { Queue, Job } from 'bull';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(
    private readonly mailerService: MailerService,
    @InjectQueue('email') private readonly emailQueue: Queue,
  ) {}

  /**
   * Initializes queue event listeners when the module is initialized.
   * Logs events related to job processing.
   */
  onModuleInit() {
    this.emailQueue.on('completed', (job: Job, result: any) => {
      this.logger.log(`Job ${job.id} completed with result: ${result}`);
    });

    this.emailQueue.on('failed', (job: Job, err: Error) => {
      this.logger.error(
        `Job ${job.id} failed with error: ${err.message}`,
        err.stack,
      );
    });

    this.emailQueue.on('active', (job: Job) => {
      this.logger.log(`Job ${job.id} is now active`);
    });

    this.emailQueue.on('stalled', (job: Job) => {
      this.logger.warn(`Job ${job.id} has stalled`);
    });

    this.emailQueue.on('progress', (job: Job, progress: number) => {
      this.logger.log(`Job ${job.id} is ${progress}% complete`);
    });

    this.emailQueue.on('removed', (job: Job) => {
      this.logger.log(`Job ${job.id} has been removed`);
    });

    this.emailQueue.on('waiting', (jobId: number | string) => {
      this.logger.log(`Job ${jobId} is waiting`);
    });

    this.emailQueue.on('delayed', (jobId: number | string) => {
      this.logger.log(`Job ${jobId} has been delayed`);
    });

    this.emailQueue.on('drained', () => {
      this.logger.log('Queue has been drained');
    });

    this.emailQueue.on('paused', () => {
      this.logger.log('Queue has been paused');
    });

    this.emailQueue.on('resumed', () => {
      this.logger.log(`Queue has been resumed`);
    });
  }

  /**
   * Sends a welcome email using the configured mailer service and adds a job to the Bull queue.
   * @param email - The email address of the recipient.
   * @returns Promise<Job> - The Bull job object representing the task in the queue.
   */
  async sendWelcomeEmail(email: string): Promise<Job> {
    const job = await this.emailQueue.add('sendWelcomeEmail', { email });
    return job;
  }

  /**
   * Processes the 'sendWelcomeEmail' job from the Bull queue.
   * Sends a welcome email using the configured mailer service.
   * @param job - The Bull job containing data for sending a welcome email.
   */
  async processEmail(job: Job) {
    const { email } = job.data;
    await this.mailerService.sendMail({
      to: email,
      subject: 'Welcome to the Company!',
      template: './welcome',
      context: {
        email,
      },
    });
  }
}
