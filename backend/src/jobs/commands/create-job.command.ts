import { BadRequestException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { v4 as uuidv4 } from 'uuid';
import {
  RABBITMQ_EXCHANGES,
  RABBITMQ_ROUTING_KEYS,
} from '../../rabbitmq/rabbitmq.config';
import { RabbitMQService } from '../../rabbitmq/rabbitmq.service';
import { JobRepository } from '../job.repository';
import { CreateJobRequestDto } from './create-job-command.request.dto';
import { CreateJobValidator } from './create-job.command.validator';
import { CreateJobResponseDto } from './create-jobs-command.response.dto';

export class CreateJobCommand {
  constructor(public readonly request: CreateJobRequestDto) {}
}

@CommandHandler(CreateJobCommand)
export class CreateJobHandler
  implements ICommandHandler<CreateJobCommand, CreateJobResponseDto>
{
  constructor(
    private readonly jobRepository: JobRepository,
    private readonly validator: CreateJobValidator,
    private readonly rabbitMQService: RabbitMQService,
  ) {}

  async execute(command: CreateJobCommand): Promise<CreateJobResponseDto> {
    const { request } = command;

    if (!this.validator.validate(request)) {
      throw new BadRequestException('Invalid data');
    }

    const formattedRequest = {
      ...request,
      id: uuidv4(),
      skills:
        request.skills && Array.isArray(request.skills)
          ? request.skills?.map((skill) => ({
              name: skill.name,
              years_required: skill.years_required,
            }))
          : [],
    };

    const job = await this.jobRepository.create(formattedRequest);

    await this.rabbitMQService.publishToExchange(
      RABBITMQ_EXCHANGES.JOB_EVENTS,
      RABBITMQ_ROUTING_KEYS.JOB_CREATED,
      {
        jobId: job.id,
        skills: job.skills,
        event: 'NEW_JOB_CREATED',
        timestamp: new Date().toISOString(),
      },
    );

    return job;
  }
}
