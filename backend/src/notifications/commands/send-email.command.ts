import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Resend } from 'resend';

export class SendEmailCommand {
  constructor(
    public readonly emailData: {
      from: string;
      to: string;
      subject: string;
      body: string;
    },
  ) {}
}

@CommandHandler(SendEmailCommand)
export class SendEmailHandler implements ICommandHandler<SendEmailCommand> {
  private readonly logger = new Logger(SendEmailHandler.name);
  private resend: Resend;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async execute(command: SendEmailCommand) {
    const { emailData } = command;

    try {
      this.logger.log(`Envoi d'un email à ${emailData.to}`);

      return this.resend.emails.send({
        from: emailData.from,
        to: emailData.to,
        subject: emailData.subject,
        html: emailData.body,
      });
    } catch (error) {
      this.logger.error(`Erreur lors de l'envoi de l'email: ${error.message}`);

      if (error.statusCode === 403 || error.statusCode === 429) {
        return error;
      }

      throw error;
    }
  }
}
