import { CommandBus, CommandHandler } from '@nestjs/cqrs';
import { renderAsync } from '@react-email/render';
import { SendWelcomeEmailRequestDto } from '../dto/send-welcome-email.request.dto';
import WelcomeEmail from '../react-templates/emails/WelcomeEmail';
import {
  AbstractEmailCommand,
  AbstractEmailHandler,
} from './abstract-email.command';

// Commande pour envoyer un email
export class SendWelcomeEmailCommand extends AbstractEmailCommand {
  constructor(public readonly userData: SendWelcomeEmailRequestDto) {
    super();
  }

  get type(): string {
    return 'registration';
  }

  get template_name(): string {
    return 'registration';
  }
}

// Handler pour envoyer un email
@CommandHandler(SendWelcomeEmailCommand)
export class SendWelcomeEmailHandler extends AbstractEmailHandler<SendWelcomeEmailCommand> {
  constructor(readonly commandBus: CommandBus) {
    super(commandBus);
  }

  async execute(command: SendWelcomeEmailCommand) {
    const { userData } = command;
    const subject = `Welcome to HR Platform`;

    const emailHtml = await renderAsync(
      WelcomeEmail({ firstName: userData.first_name }),
    );
    this.logger.log(
      `Sending email to ${userData.email} with subject ${subject}`,
    );
    const emailData = {
      user_id: userData.user_id,
      sender_email: 'Acme <onboarding@resend.dev>',
      sender_name: 'HR Platform',
      type: command.type,
      subject: subject,
      body: emailHtml,
      template_name: command.template_name,
      recipient_email: userData.email,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await this.queueEmail(emailData);
  }
}
