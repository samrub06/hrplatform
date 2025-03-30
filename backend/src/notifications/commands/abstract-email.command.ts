import { Logger } from '@nestjs/common';
import { ICommandHandler } from '@nestjs/cqrs';
import { EmailDispatcherService } from '../email-dispatcher.service';

export abstract class AbstractEmailCommand {
  abstract get type(): string;
}

export abstract class AbstractEmailHandler<T extends AbstractEmailCommand>
  implements ICommandHandler<T>
{
  protected readonly logger = new Logger(this.constructor.name);

  constructor(
    protected readonly emailDispatcherService: EmailDispatcherService,
  ) {}

  abstract execute(command: T): Promise<any>;

  protected async queueEmail(emailData: {
    user_id: string;
    sender_email: string;
    sender_name: string;
    type: string;
    subject: string;
    body: string;
    template_name: string;
    recipient_email: string;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.logger.log(`Queueing email to ${emailData.recipient_email}`);

    try {
      const queuedEmail =
        await this.emailDispatcherService.queueEmail(emailData);
      this.logger.log(`Email queued successfully with ID: ${queuedEmail.id}`);
      return queuedEmail;
    } catch (error) {
      this.logger.error(`Failed to queue email: ${error.message}`, error.stack);
      throw error;
    }
  }
}
