import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/sequelize';
import { Job } from '../models/job.model';

export class RemoveJobCommand {
  constructor(public readonly id: number) {}
}

@CommandHandler(RemoveJobCommand)
export class RemoveJobHandler implements ICommandHandler<RemoveJobCommand> {
  constructor(
    @InjectModel(Job)
    private jobModel: typeof Job,
  ) {}

  async execute(command: RemoveJobCommand): Promise<void> {
    const { id } = command;
    const job = await this.jobModel.findOne({ where: { id } });

    if (!job) {
      throw new NotFoundException(`Job with ID ${id} not found`);
    }

    await job.destroy();
  }
}
