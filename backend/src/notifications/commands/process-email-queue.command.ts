import { Logger } from '@nestjs/common';
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/sequelize';
import { Email } from '../../models/email_logs.model';
import { SendEmailCommand } from './send-email.command';

export class ProcessEmailQueueCommand {
  constructor() {}
}

@CommandHandler(ProcessEmailQueueCommand)
export class ProcessEmailQueueHandler
  implements ICommandHandler<ProcessEmailQueueCommand>
{
  private readonly logger = new Logger(ProcessEmailQueueHandler.name);

  constructor(
    @InjectModel(Email)
    private emailModel: typeof Email,
    private commandBus: CommandBus,
  ) {}

  async execute(): Promise<void> {
    this.logger.log('Processing email queue...');

    try {
      // Récupérer les emails en attente
      const pendingEmails = await this.emailModel.findAll({
        where: {
          status: 'pending',
        },
        limit: 10, // Traiter 10 emails à la fois
      });

      this.logger.log(`${pendingEmails.length} emails found in the queue`);

      for (const email of pendingEmails) {
        try {
          const response = await this.commandBus.execute(
            new SendEmailCommand({
              to: email.recipient_email,
              from: `${email.sender_name} <${email.sender_email}>`,
              subject: email.subject,
              body: email.body,
            }),
          );

          if (
            response?.error?.statusCode === 403 ||
            response?.error?.statusCode === 429
          ) {
            this.logger.error(
              `Error sending email ${email.id}: ${response.error.message}`,
            );
            await email.update({
              status: 'failed',
              updated_at: new Date(),
            });
          } else {
            await email.update({
              status: 'sent',
              sent_at: new Date(),
              updated_at: new Date(),
            });

            this.logger.log(`Email ${email.id} sent successfully`);
          }
        } catch (error) {
          this.logger.error(`Error sending email ${email.id}:`, error);

          await email.update({
            status: 'failed',
            updated_at: new Date(),
          });
        }
      }
    } catch (error) {
      this.logger.error('Error processing email queue:', error);
    }
  }
}
