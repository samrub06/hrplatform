import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateJobDto } from '../dto/update-job-dto';
import { JobRepository } from '../job.repository';

export class UpdateJobCommand {
  constructor(
    public readonly id: string,
    public readonly updateJobDto: UpdateJobDto,
  ) {}
}

@CommandHandler(UpdateJobCommand)
export class UpdateJobHandler implements ICommandHandler<UpdateJobCommand> {
  constructor(private readonly jobRepository: JobRepository) {}

  async execute(command: UpdateJobCommand) {
    const { id, updateJobDto } = command;

    if (updateJobDto.salary_offered && updateJobDto.salary_offered < 0) {
      throw new BadRequestException('Salary cannot be negative');
    }

    const updatedJob = await this.jobRepository.update(id, updateJobDto);
    if (!updatedJob) {
      throw new NotFoundException(`Job with ID ${id} not found`);
    }

    return updatedJob;
  }
}