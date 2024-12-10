import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { SequelizeModule } from '@nestjs/sequelize';

import { CreateJobHandler } from './commands/create-job.command';
import { RemoveJobHandler } from './commands/remove-job.command';
import { UpdateJobHandler } from './commands/update-job.command copy';
import { JobsController } from './jobs.controller';
import { Job } from './models/job.model';
import { GetJobsHandler } from './queries/get-jobs-query';

const CommandHandlers = [CreateJobHandler, UpdateJobHandler, RemoveJobHandler];

const QueryHandlers = [GetJobsHandler];

@Module({
  imports: [CqrsModule, SequelizeModule.forFeature([Job])],
  controllers: [JobsController],
  providers: [...CommandHandlers, ...QueryHandlers],
})
export class JobsModule {}
