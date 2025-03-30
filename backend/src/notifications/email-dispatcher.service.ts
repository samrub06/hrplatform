import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Email } from '../models/emails.model';
import { EmailService } from './email.service';

@Injectable()
export class EmailDispatcherService {
  private readonly logger = new Logger(EmailDispatcherService.name);

  constructor(
    @InjectModel(Email)
    private emailModel: typeof Email,
    private emailService: EmailService,
  ) {}

  async queueEmail(emailData: {
    user_id: string;
    sender_email: string;
    sender_name: string;
    type: string;
    subject: string;
    body: string;
    template_name: string;
    recipient_email: string;
    createdAt: Date;
    updatedAt: Date;
  }): Promise<Email> {
    return this.emailModel.create({
      ...emailData,
      status: 'pending',
      has_attachment: false,
      is_read: false,
      sent_at: null,
      receivedAt: null,
    });
  }

  @Cron(process.env.CRON_EXPRESSION)
  async processEmailQueue() {
    this.logger.log('Managing emails queue...');

    try {
      // Récupérer les emails en attente
      const pendingEmails = await this.emailModel.findAll({
        where: {
          status: 'pending',
          // Optionnel: ajouter une condition pour limiter le nombre d'emails traités par lot
          created_at: { [Op.lt]: new Date(Date.now() - 5 * 60 * 1000) }, // Emails créés il y a plus de 5 minutes
        },
        limit: 10, // Traiter 10 emails à la fois
      });

      this.logger.log(`${pendingEmails.length} emails in queue found`);

      for (const email of pendingEmails) {
        try {
          //send the email
          await this.emailService.sendEmail({
            to: email.recipient_email,
            from: `${email.sender_name} <${email.sender_email}>`,
            subject: email.subject,
            body: email.body,
          });

          //update the email status to sent
          await email.update({
            status: 'sent',
            sent_at: new Date(),
            updated_at: new Date(),
          });

          this.logger.log(`Email ${email.id} sent successfully`);
        } catch (error) {
          this.logger.error(`Error sending email ${email.id}:`, error);

          //update the email status to failed
          await email.update({
            status: 'failed',
            updated_at: new Date(),
          });
        }
      }
    } catch (error) {
      this.logger.error(
        "Erreur lors du traitement de la file d'attente des emails:",
        error,
      );
    }
  }

  async retryFailedEmails() {
    const failedEmails = await this.emailModel.findAll({
      where: {
        status: 'failed',
      },
      limit: 5,
    });

    for (const email of failedEmails) {
      await email.update({
        status: 'pending',
        updated_at: new Date(),
      });
    }

    return failedEmails.length;
  }
}
