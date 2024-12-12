/* import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitMQService implements OnModuleInit {
  private connection: amqp.Connection;
  private channel: amqp.Channel;

  constructor(private configService: ConfigService) {}

  async publishMessage(queue: string, message: any) {
    try {
      await this.channel.assertQueue(queue, { durable: true });
      this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
      console.log(`Message envoyé à la queue ${queue}`);
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
      throw error;
    }
  }

  async consumeMessages(queue: string, callback: (message: any) => void) {
    try {
      await this.channel.assertQueue(queue, { durable: true });
      this.channel.consume(queue, (message) => {
        if (message) {
          const content = JSON.parse(message.content.toString());
          callback(content);
          this.channel.ack(message);
        }
      });
      console.log(`En écoute sur la queue ${queue}`);
    } catch (error) {
      console.error('Erreur lors de la consommation des messages:', error);
      throw error;
    }
  }
}
 */
