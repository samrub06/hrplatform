import { Module } from '@nestjs/common';
import { RabbitMQModule } from '../rabbitmq/rabbitmq.module';
import { NotificationService } from './notifications.service';

@Module({
  imports: [RabbitMQModule],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationsModule {}
