import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/sequelize';
import { EmailLogs } from '../../models/email_logs.model';

export class QueueEmailCommand {
  constructor(
    public readonly emailData: {
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
    },
  ) {}
}

@CommandHandler(QueueEmailCommand)
export class QueueEmailHandler implements ICommandHandler<QueueEmailCommand> {
  private readonly logger = new Logger(QueueEmailHandler.name);

  constructor(
    @InjectModel(EmailLogs)
    private emailModel: typeof EmailLogs,
  ) {}

  async execute(command: QueueEmailCommand): Promise<EmailLogs> {
    this.logger.log(`Queueing email for ${command.emailData.recipient_email}`);

    return this.emailModel.create({
      ...command.emailData,
      status: 'pending',
      has_attachment: false,
      is_read: false,
      sent_at: null,
      receivedAt: null,
    });
  }
}
