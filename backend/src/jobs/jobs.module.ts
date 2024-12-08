import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { SequelizeModule } from '@nestjs/sequelize';

import { CreateJobHandler } from './handlers/create-job-handler';
import { GetJobsHandler } from './handlers/get-jobs.handler';
import { JobsController } from './jobs.controller';
import { Job } from './models/job.model';

const CommandHandlers = [CreateJobHandler];
const QueryHandlers = [GetJobsHandler];

@Module({
  imports: [CqrsModule, SequelizeModule.forFeature([Job])],
  controllers: [JobsController],
  providers: [...CommandHandlers, ...QueryHandlers],
})
export class JobsModule {}
