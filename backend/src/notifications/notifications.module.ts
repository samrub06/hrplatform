import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { SequelizeModule } from '@nestjs/sequelize';
import { Email } from 'src/models/emails.model';
import { RabbitMQModule } from '../rabbitmq/rabbitmq.module';
import { SendWelcomeEmailHandler } from './commands/send-welcome-email.command';
import { EmailDispatcherService } from './email-dispatcher.service';
import { EmailService } from './email.service';
import { NotificationService } from './notifications.service';
@Module({
  imports: [RabbitMQModule, SequelizeModule.forFeature([Email]), CqrsModule],
  providers: [
    NotificationService,
    EmailService,
    EmailDispatcherService,
    SendWelcomeEmailHandler,
  ],
  exports: [NotificationService, EmailDispatcherService],
})
export class NotificationsModule {}
