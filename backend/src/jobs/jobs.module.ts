import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { SequelizeModule } from '@nestjs/sequelize';
import { AdminModule } from '../admin/admin.module';
import { AuthModule } from '../auth/auth.module';
import { CaslModule } from '../casl/casl.module';
import { Job } from '../models/job.model';
import { User } from '../models/user.model';
import { PermissionModule } from '../permission/permission.module';
import { RabbitMQModule } from '../rabbitmq/rabbitmq.module';
import { UsersModule } from '../users/users.module';
import { CreateJobHandler } from './commands/create-job.command';
import { CreateJobValidator } from './commands/create-job.command.validator';
import { DeleteJobHandler } from './commands/delete-job.command';
import { UpdateJobHandler } from './commands/update-job.command';
import { JobRepository } from './job.repository';
import { JobsController } from './jobs.controller';
import { GetJobsHandler } from './queries/get-jobs-query';

const CommandHandlers = [CreateJobHandler, UpdateJobHandler, DeleteJobHandler];
const QueryHandlers = [GetJobsHandler];

@Module({
  imports: [
    CqrsModule,
    PermissionModule,
    CaslModule,
    AuthModule,
    AdminModule,
    UsersModule,
    SequelizeModule.forFeature([Job, User]),
    RabbitMQModule,
  ],
  controllers: [JobsController],
  providers: [
    JobRepository,
    ...CommandHandlers,
    CreateJobValidator,
    ...QueryHandlers,
  ],
})
export class JobsModule {}
