import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { SequelizeModule } from '@nestjs/sequelize';
import { Email } from 'src/models/emails.model';
import { RabbitMQModule } from '../rabbitmq/rabbitmq.module';
import { EmailSchedulerService } from './commands/email-scheduler.command';
import { ProcessEmailQueueHandler } from './commands/process-email-queue.command';
import { QueueEmailHandler } from './commands/queue-email.command';
import { RetryFailedEmailsHandler } from './commands/retry-failed-emails.command';
import { SendEmailHandler } from './commands/send-email.command';
import { SendWelcomeEmailHandler } from './commands/send-welcome-email.command';
import { NotificationService } from './notifications.service';

const CommandHandlers = [
  SendWelcomeEmailHandler,
  QueueEmailHandler,
  ProcessEmailQueueHandler,
  RetryFailedEmailsHandler,
  SendEmailHandler,
];

@Module({
  imports: [RabbitMQModule, SequelizeModule.forFeature([Email]), CqrsModule],
  providers: [NotificationService, EmailSchedulerService, ...CommandHandlers],
  exports: [NotificationService],
})
export class NotificationsModule {}
