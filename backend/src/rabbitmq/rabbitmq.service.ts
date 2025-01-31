import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqplib';
import { RABBITMQ_EXCHANGES } from './rabbitmq.config';

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
  private connection: amqp.Connection;
  private channel: amqp.Channel;
  private initialized = false;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    await this.initialize();
  }

  private async initialize() {
    if (this.initialized) return;

    try {
      const rabbitmqUrl = this.configService.get<string>(
        `${process.env.NODE_ENV}_RABBITMQ_URL`,
      );
      this.connection = await amqp.connect(rabbitmqUrl);
      this.channel = await this.connection.createChannel();

      // Création des exchanges
      await Promise.all([
        this.channel.assertExchange(RABBITMQ_EXCHANGES.USER_EVENTS, 'topic', {
          durable: true,
        }),
        this.channel.assertExchange(RABBITMQ_EXCHANGES.JOB_EVENTS, 'topic', {
          durable: true,
        }),
        this.channel.assertExchange(RABBITMQ_EXCHANGES.CV_EVENTS, 'topic', {
          durable: true,
        }),
      ]);

      this.initialized = true;
      console.log('RabbitMQ Established with success');
    } catch (error) {
      console.error('Error connecting to RabbitMQ:', error);
      throw error;
    }
  }

  async publishToExchange(exchange: string, routingKey: string, message: any) {
    try {
      this.channel.publish(
        exchange,
        routingKey,
        Buffer.from(JSON.stringify(message)),
        { persistent: true },
      );
      console.log(
        `Message publié sur l'exchange ${exchange} avec la routing key ${routingKey}`,
      );
    } catch (error) {
      console.error('Erreur lors de la publication du message:', error);
      throw error;
    }
  }

  async bindQueueToExchange(
    queue: string,
    exchange: string,
    routingKey: string,
  ) {
    if (!this.initialized) {
      await this.initialize();
    }

    try {
      await this.channel.assertQueue(queue, { durable: true });
      await this.channel.bindQueue(queue, exchange, routingKey);
      console.log(
        `Queue ${queue} liée à l'exchange ${exchange} avec la routing key ${routingKey}`,
      );
    } catch (error) {
      console.error('Erreur lors de la liaison de la queue:', error);
      throw error;
    }
  }

  async consumeQueue(queue: string, callback: (message: any) => void) {
    try {
      await this.channel.assertQueue(queue, { durable: true });
      this.channel.consume(queue, (message) => {
        if (message) {
          const content = JSON.parse(message.content.toString());
          callback(content);
          this.channel.ack(message);
        }
      });
      console.log(`Consommation démarrée sur la queue ${queue}`);
    } catch (error) {
      console.error('Erreur lors de la consommation de la queue:', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    try {
      await this.channel?.close();
      await this.connection?.close();
      console.log('Connexion RabbitMQ fermée');
    } catch (error) {
      console.error(
        'Erreur lors de la fermeture de la connexion RabbitMQ:',
        error,
      );
    }
  }
}
