import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JobRepository } from '../job.repository';

export class DeleteJobCommand {
  constructor(public readonly id: string) {}
}

@CommandHandler(DeleteJobCommand)
export class DeleteJobHandler implements ICommandHandler<DeleteJobCommand> {
  constructor(private readonly jobRepository: JobRepository) {}

  async execute(command: DeleteJobCommand): Promise<void> {
    const { id } = command;

    const job = await this.jobRepository.findById(id);
    if (!job) {
      throw new NotFoundException('Job not found');
    }

    await this.jobRepository.delete(id);
  }
}
