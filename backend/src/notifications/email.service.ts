import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as Handlebars from 'handlebars';
import * as marked from 'marked';
import * as path from 'path';
import { Resend } from 'resend';

type EmailTemplate = 'job' | 'welcome' | 'match'; // Ajoutez d'autres types selon vos besoins

@Injectable()
export class EmailService {
  private resend: Resend;
  private templates: Map<
    string,
    Map<EmailTemplate, Handlebars.TemplateDelegate>
  > = new Map();

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
    this.loadTemplates();
  }

  private async loadTemplates() {
    const languages = ['en', 'fr'];
    const templateTypes: EmailTemplate[] = ['job', 'welcome', 'match'];

    for (const lang of languages) {
      const langTemplates = new Map<
        EmailTemplate,
        Handlebars.TemplateDelegate
      >();

      for (const type of templateTypes) {
        try {
          const templatePath = path.join(
            process.cwd(),
            'src',
            'notifications',
            'templates',
            lang,
            `${type}.template.md`,
          );
          const template = await fs.readFile(templatePath, 'utf-8');
          langTemplates.set(type, Handlebars.compile(template));
        } catch (error) {
          console.warn(`Template not found: ${lang}/${type}`);
        }
      }

      this.templates.set(lang, langTemplates);
    }
  }

  async sendTemplateEmail(
    to: string,
    templateType: EmailTemplate,
    data: any,
    lang: string = 'en',
    subject?: string,
  ) {
    const langTemplates = this.templates.get(lang);
    const template = langTemplates?.get(templateType);

    if (!template) {
      throw new Error(`Template not found: ${lang}/${templateType}`);
    }

    const markdown = template({
      ...data,
      currentYear: new Date().getFullYear(),
    });

    const html = await marked.parse(markdown);
    return this.sendEmail(
      to,
      subject || this.getDefaultSubject(templateType, data, lang),
      html,
    );
  }

  private getDefaultSubject(
    type: EmailTemplate,
    data: any,
    lang: string,
  ): string {
    const subjects = {
      job: {
        en: `New Job Offer: ${data?.jobData?.name || ''}`,
        fr: `Nouvelle offre d'emploi : ${data?.jobData?.name || ''}`,
      },
      welcome: {
        en: `Welcome ${data?.userData?.firstName || ''} to HR Platform`,
        fr: `Bienvenue ${data?.userData?.firstName || ''} sur HR Platform`,
      },
      match: {
        en: 'New Job Match Found',
        fr: "Nouvelle correspondance d'emploi trouvée",
      },
    };
    return subjects[type][lang];
  }

  private async sendEmail(to: string, subject: string, content: string) {
    try {
      return await this.resend.emails.send({
        from: 'HR Platform <onboarding@resend.dev>',
        to: [to],
        subject: subject,
        html: content,
      });
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }
}
