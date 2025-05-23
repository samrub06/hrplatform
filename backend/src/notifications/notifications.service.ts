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

  private async handleUserNotification(emailData: any) {
    switch (emailData.event) {
      case 'NEW_USER_REGISTERED':
        await this.logUserRegistration(emailData);
        break;
      case 'USER_UPDATED':
        await this.handleUserUpdate(emailData);
        break;
      case 'CV_JOB_MATCHED':
        await this.handleCVMatched(emailData);
        break;
      case 'JOB_OFFER_CREATED':
        await this.handleJobOfferCreated(emailData);
        break;
    }
  }

  private async logUserRegistration(userData: any) {
    // Logging dans une base de données ou un service externe
    console.log(`New user registered: ${userData.email}`);
  }

  private async handleUserUpdate(userData: any) {
    // Traitement des mises à jour utilisateur
    console.log(`User updated: ${userData.email}`);
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

  private async handleJobOfferCreated(jobData: any) {
    // Logique d'envoi de notification (email, notification in-app, etc.)
    console.log(`New job offer created: ${jobData.jobId}`);
    /*  await this.emailService.sendJobOfferEmail(
      jobData.jobData.email_address,
      'job',
      { jobData: jobData.jobData },
      'fr',
    ); */
  }
}
