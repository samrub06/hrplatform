import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqplib';
import { RABBITMQ_EXCHANGES } from './rabbitmq.config';

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
  private connection: amqp.Connection;
  private channel: amqp.Channel;
  private initialized = false;
  private reconnectTimeout: NodeJS.Timeout;
  private readonly maxRetries = 5;
  private retryCount = 0;
  private messageQueue: Array<{
    exchange: string;
    routingKey: string;
    message: any;
  }> = [];

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    await this.initialize();
  }

  private async initialize() {
    if (this.initialized && this.channel) return;

    try {
      // Réinitialiser l'état
      this.initialized = false;
      this.channel = null;

      const rabbitmqUrl = this.configService.get<string>('RABBITMQ_URL');
      console.log('Tentative de connexion à RabbitMQ avec URL:', rabbitmqUrl);

      this.connection = await amqp.connect(rabbitmqUrl, {
        heartbeat: 60,
        timeout: 30000,
        family: 4, // Force l'utilisation d'IPv4
      });

      // Gestion des événements de connexion
      this.connection.on('error', (err) => {
        console.error('Erreur de connexion RabbitMQ:', err);
        this.handleConnectionError();
      });

      this.connection.on('close', () => {
        console.log('Connexion RabbitMQ fermée');
        this.handleConnectionError();
      });

      console.log('Création du canal RabbitMQ...');
      this.channel = await this.connection.createChannel();
      await this.channel.prefetch(1);

      // Gestion des événements du channel
      this.channel.on('error', (err) => {
        console.error('Erreur de channel RabbitMQ:', err);
        this.handleConnectionError();
      });

      this.channel.on('close', () => {
        console.log('Channel RabbitMQ fermé');
        this.handleConnectionError();
      });

      console.log('Création des exchanges...');
      // Création des exchanges
      await Promise.all([
        this.channel.assertExchange(RABBITMQ_EXCHANGES.USER_EVENTS, 'topic', {
          durable: true,
          autoDelete: false,
        }),
        this.channel.assertExchange(RABBITMQ_EXCHANGES.JOB_EVENTS, 'topic', {
          durable: true,
          autoDelete: false,
        }),
        this.channel.assertExchange(RABBITMQ_EXCHANGES.CV_EVENTS, 'topic', {
          durable: true,
          autoDelete: false,
        }),
      ]);

      // Réessayer d'envoyer les messages en attente
      await this.processPendingMessages();

      this.initialized = true;
      this.retryCount = 0;
      console.log('RabbitMQ initialisé avec succès');
    } catch (error) {
      console.error("Erreur lors de l'initialisation de RabbitMQ:", error);
      this.initialized = false;
      this.channel = null;
      this.handleConnectionError();
    }
  }

  private async processPendingMessages() {
    if (this.messageQueue.length > 0) {
      console.log(
        `Traitement de ${this.messageQueue.length} messages en attente`,
      );
      for (const msg of this.messageQueue) {
        try {
          await this.publishToExchange(
            msg.exchange,
            msg.routingKey,
            msg.message,
          );
        } catch (error) {
          console.error(
            'Erreur lors du traitement des messages en attente:',
            error,
          );
        }
      }
      this.messageQueue = [];
    }
  }

  private async handleConnectionError() {
    this.initialized = false;

    if (this.retryCount < this.maxRetries) {
      this.retryCount++;
      const delay = Math.min(1000 * Math.pow(2, this.retryCount), 30000);

      console.log(
        `Tentative de reconnexion à RabbitMQ dans ${delay}ms (tentative ${this.retryCount}/${this.maxRetries})`,
      );

      if (this.reconnectTimeout) {
        clearTimeout(this.reconnectTimeout);
      }

      this.reconnectTimeout = setTimeout(async () => {
        try {
          await this.initialize();
        } catch (error) {
          console.error('Échec de la reconnexion à RabbitMQ:', error);
        }
      }, delay);
    } else {
      console.error('Nombre maximum de tentatives de reconnexion atteint');
    }
  }

  async publishToExchange(exchange: string, routingKey: string, message: any) {
    if (!this.initialized || !this.channel) {
      console.log('RabbitMQ non initialisé, message mis en attente');
      this.messageQueue.push({ exchange, routingKey, message });
      return;
    }

    try {
      await this.channel.publish(
        exchange,
        routingKey,
        Buffer.from(JSON.stringify(message)),
        {
          persistent: true,
          deliveryMode: 2,
        },
      );
      console.log(
        `Message publié sur l'exchange ${exchange} avec la routing key ${routingKey}`,
      );
    } catch (error) {
      console.error('Erreur lors de la publication du message:', error);
      this.messageQueue.push({ exchange, routingKey, message });
      throw error;
    }
  }

  async bindQueueToExchange(
    queue: string,
    exchange: string,
    routingKey: string,
  ) {
    if (!this.initialized || !this.channel) {
      await this.initialize();
      // Attendre que le canal soit disponible
      let attempts = 0;
      while (!this.channel && attempts < 5) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        attempts++;
      }
    }

    if (!this.channel) {
      throw new Error(
        "Impossible d'initialiser le canal RabbitMQ après plusieurs tentatives",
      );
    }

    try {
      await this.channel.assertQueue(queue, {
        durable: true,
        autoDelete: false,
      });
      await this.channel.bindQueue(queue, exchange, routingKey);
      console.log(
        `Queue ${queue} liée à l'exchange ${exchange} avec la routing key ${routingKey}`,
      );
    } catch (error) {
      console.error('Erreur lors de la liaison de la queue:', error);
      // Réinitialiser l'état en cas d'erreur
      this.initialized = false;
      this.channel = null;
      throw error;
    }
  }

  async consumeQueue(queue: string, callback: (message: any) => void) {
    if (!this.initialized) {
      await this.initialize();
    }

    try {
      await this.channel.assertQueue(queue, {
        durable: true,
        autoDelete: false,
      });

      this.channel.consume(queue, async (message) => {
        if (message) {
          try {
            const content = JSON.parse(message.content.toString());
            await callback(content);
            this.channel.ack(message);
          } catch (error) {
            console.error('Erreur lors du traitement du message:', error);
            // Rejeter le message et le remettre dans la queue
            this.channel.nack(message, false, true);
          }
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
      if (this.reconnectTimeout) {
        clearTimeout(this.reconnectTimeout);
      }
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
