import { Injectable } from '@nestjs/common';
import { render } from '@react-email/render';
import { Resend } from 'resend';
import WelcomeEmail from './react-templates/emails/WelcomeEmail';

@Injectable()
export class EmailService {
  private resend: Resend;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async sendWelcomeEmail(userData: any) {
    const html = await render(
      WelcomeEmail({
        firstName: userData.firstName,
      }),
    );

    return this.resend.emails.send({
      from: 'HR Platform <onboarding@resend.dev>',
      to: 'delivered@resend.dev',
      subject: `Welcome ${userData.firstName} to HR Platform`,
      html: html,
    });
  }
}
