import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { SequelizeModule } from '@nestjs/sequelize';
import { AdminModule } from 'src/admin/admin.module';
import { AuthModule } from 'src/auth/auth.module';
import { CaslModule } from 'src/casl/casl.module';
import { User } from 'src/models/user.model';
import { PermissionModule } from 'src/permission/permission.module';
import { RabbitMQService } from 'src/rabbitmq/rabbitmq.service';
import { UsersModule } from 'src/users/users.module';
import { Job } from '../models/job.model';
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
  ],
  controllers: [JobsController],
  providers: [
    JobRepository,
    ...CommandHandlers,
    CreateJobValidator,
    ...QueryHandlers,
    RabbitMQService,
  ],
})
export class JobsModule {}
