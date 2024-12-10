import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/sequelize';
import { UpdateJobDto } from '../dto/update-job-dto';
import { Job } from '../models/job.model';

export class DeletJobCommand {
  constructor(
    public readonly id: string,
    public readonly updateJobDto: UpdateJobDto,
  ) {}
}

@CommandHandler(DeletJobCommand)
export class UpdateJobHandler implements ICommandHandler<DeletJobCommand> {
  constructor(
    @InjectModel(Job)
    private jobModel: typeof Job,
  ) {}

  async execute(command: DeletJobCommand): Promise<Job> {
    const { id, updateJobDto } = command;

    // Logique métier
    const job = await this.jobModel.findByPk(id);
    if (!job) {
      throw new NotFoundException(`Job with ID ${id} not found`);
    }

    // Validation métier supplémentaire si nécessaire
    if (updateJobDto.salary_offered && updateJobDto.salary_offered < 0) {
      throw new BadRequestException('Salary cannot be negative');
    }

    await job.update(updateJobDto);
    return job;
  }
}
