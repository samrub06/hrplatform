import { Module } from '@nestjs/common';
import { RabbitMQModule } from '../rabbitmq/rabbitmq.module';
import { NotificationService } from './notifications.services';

@Module({
  imports: [RabbitMQModule],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationsModule {}
