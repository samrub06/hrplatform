import { Module } from '@nestjs/common';
import { RabbitMQModule } from '../rabbitmq/rabbitmq.module';
import { EmailService } from './email.service';
import { NotificationService } from './notifications.service';

@Module({
  imports: [RabbitMQModule],
  providers: [NotificationService, EmailService],
  exports: [NotificationService],
})
export class NotificationsModule {}
