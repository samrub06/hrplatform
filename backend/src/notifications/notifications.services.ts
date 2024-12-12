import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  RABBITMQ_EXCHANGES,
  RABBITMQ_QUEUES,
  RABBITMQ_ROUTING_KEYS,
} from '../rabbitmq/rabbitmq.config';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';

@Injectable()
export class NotificationService implements OnModuleInit {
  constructor(private readonly rabbitMQService: RabbitMQService) {}

  async onModuleInit() {
    await this.setupQueuesAndBindings();
    await this.startConsumers();
  }

  private async setupQueuesAndBindings() {
    await this.rabbitMQService.bindQueueToExchange(
      RABBITMQ_QUEUES.USER_NOTIFICATION,
      RABBITMQ_EXCHANGES.USER_EVENTS,
      RABBITMQ_ROUTING_KEYS.USER_CREATED,
    );
  }

  private async startConsumers() {
    await this.rabbitMQService.consumeQueue(
      RABBITMQ_QUEUES.USER_NOTIFICATION,
      this.handleUserNotification.bind(this),
    );
  }

  private async handleUserNotification(message: any) {
    console.log('Notification reçue:', message);
    if (message.event === 'NEW_USER_REGISTERED') {
      await this.sendWelcomeEmail(message);
    }
  }

  private async sendWelcomeEmail(userData: any) {
    console.log(`Envoi d'un email de bienvenue à ${userData.email}`);
    // Implémentez ici l'envoi d'email réel
  }
}
