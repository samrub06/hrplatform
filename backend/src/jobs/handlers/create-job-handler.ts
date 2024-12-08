import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/sequelize';
import { CreateJobCommand } from '../commands/create-job.command';
import { Job } from '../models/job.model';

@CommandHandler(CreateJobCommand)
export class CreateJobHandler implements ICommandHandler<CreateJobCommand> {
  constructor(
    @InjectModel(Job)
    private jobModel: typeof Job,
  ) {}

  async execute(command: CreateJobCommand): Promise<Job> {
    const { createJobDto } = command;
    return this.jobModel.create({ ...createJobDto });
  }
}
