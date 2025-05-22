import { Injectable, Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ProcessEmailQueueCommand } from './process-email-queue.command';

@Injectable()
export class EmailSchedulerService {
  private readonly logger = new Logger(EmailSchedulerService.name);

  constructor(private readonly commandBus: CommandBus) {}

  @Cron(process.env.CRON_EMAIL_QUEUE || CronExpression.EVERY_MINUTE)
  async handleCron() {
    this.logger.log('Starting scheduled email queue processing');
    await this.commandBus.execute(new ProcessEmailQueueCommand());
  }
}
