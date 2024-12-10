import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/sequelize';
import { v4 as uuidv4 } from 'uuid';
import { CreateJobDto } from '../dto/create-job-dto';
import { Job } from '../models/job.model';

export class CreateJobCommand {
  constructor(public readonly createJobDto: CreateJobDto) {}
}

@CommandHandler(CreateJobCommand)
export class CreateJobHandler implements ICommandHandler<CreateJobCommand> {
  constructor(
    @InjectModel(Job)
    private jobModel: typeof Job,
  ) {}

  async execute(command: CreateJobCommand): Promise<Job> {
    const { createJobDto } = command;

    // Logique métier
    const job = await this.jobModel.create({
      ...createJobDto,
      id: uuidv4(),
    });

    // Vous pourriez ajouter ici d'autres logiques métier
    // Par exemple, envoyer des notifications, vérifier des conditions, etc.

    return job;
  }
}
