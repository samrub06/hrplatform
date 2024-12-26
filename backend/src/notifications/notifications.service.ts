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
    switch (message.event) {
      case 'NEW_USER_REGISTERED':
        await this.sendWelcomeEmail(message);
        await this.logUserRegistration(message);
        break;
      case 'USER_UPDATED':
        await this.handleUserUpdate(message);
        break;
      case 'CV_JOB_MATCHED':
        await this.handleCVMatched(message);
        break;
      // Autres cas d'utilisation
    }
  }

  private async sendWelcomeEmail(userData: any) {
    // Envoi d'email via un service d'email (SendGrid, AWS SES, etc.)
    console.log(`Email de bienvenue envoyé à ${userData.email}`);
  }

  private async logUserRegistration(userData: any) {
    // Logging dans une base de données ou un service externe
    console.log(`Nouvel utilisateur enregistré: ${userData.email}`);
  }

  private async handleUserUpdate(userData: any) {
    // Traitement des mises à jour utilisateur
    console.log(`Utilisateur mis à jour: ${userData.email}`);
  }

  private async handleCVMatched(message: any) {
    const { userId, matches } = message;

    // Envoyer une notification pour chaque match
    for (const match of matches) {
      await this.sendJobMatchNotification(userId, match);
    }
  }

  private async sendJobMatchNotification(userId: string, match: any) {
    // Logique d'envoi de notification (email, notification in-app, etc.)
    console.log(
      `Match found for user ${userId} with job ${match.jobId} (score: ${match.score})`,
    );
  }
}
