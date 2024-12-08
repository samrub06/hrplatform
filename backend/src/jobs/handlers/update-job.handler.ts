import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/sequelize';
import { UpdateJobDto } from '../dto/update-job-dto';
import { Job } from '../models/job.model';

export class UpdateJobCommand {
  constructor(
    public readonly id: number,
    public readonly updateJobDto: UpdateJobDto,
  ) {}
}

@CommandHandler(UpdateJobCommand)
export class UpdateJobHandler implements ICommandHandler<UpdateJobCommand> {
  constructor(
    @InjectModel(Job)
    private jobModel: typeof Job,
  ) {}

  async execute(command: UpdateJobCommand): Promise<Job> {
    const { id, updateJobDto } = command;
    const job = await this.jobModel.findOne({ where: { id } });

    if (!job) {
      throw new NotFoundException(`Job with ID ${id} not found`);
    }

    await this.jobModel.update(updateJobDto, { where: { id } });
    return this.jobModel.findOne({ where: { id } });
  }
}
