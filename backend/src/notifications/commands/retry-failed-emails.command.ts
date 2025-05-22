import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/sequelize';
import { Email } from '../../models/emails.model';

export class RetryFailedEmailsCommand {
  constructor() {}
}

@CommandHandler(RetryFailedEmailsCommand)
export class RetryFailedEmailsHandler
  implements ICommandHandler<RetryFailedEmailsCommand>
{
  private readonly logger = new Logger(RetryFailedEmailsHandler.name);

  constructor(
    @InjectModel(Email)
    private emailModel: typeof Email,
  ) {}

  async execute(): Promise<number> {
    this.logger.log('Retrying failed emails...');

    const failedEmails = await this.emailModel.findAll({
      where: {
        status: 'failed',
      },
      limit: 5,
    });

    for (const email of failedEmails) {
      await email.update({
        status: 'pending',
        updated_at: new Date(),
      });
    }

    this.logger.log(`${failedEmails.length} emails queued`);
    return failedEmails.length;
  }
}
