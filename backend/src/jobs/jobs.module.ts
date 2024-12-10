import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { SequelizeModule } from '@nestjs/sequelize';
import { CreateJobHandler } from './commands/create-job.command';
import { CreateJobValidator } from './commands/create-job.command.validator';
import { UpdateJobHandler } from './commands/update-job.command';
import { JobRepository } from './job.repository';
import { JobsController } from './jobs.controller';
import { Job } from './models/job.model';
import { GetJobsHandler } from './queries/get-jobs-query';

const CommandHandlers = [CreateJobHandler, UpdateJobHandler];
const QueryHandlers = [GetJobsHandler];

@Module({
  imports: [CqrsModule, SequelizeModule.forFeature([Job])],
  controllers: [JobsController],
  providers: [
    JobRepository,
    ...CommandHandlers,
    CreateJobValidator,
    ...QueryHandlers,
  ],
})
export class JobsModule {}
