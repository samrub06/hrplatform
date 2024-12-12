import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { SequelizeModule } from '@nestjs/sequelize';
import { AdminModule } from 'src/admin/admin.module';
import { AuthModule } from 'src/auth/auth.module';
import { CaslModule } from 'src/casl/casl.module';
import { PermissionModule } from 'src/permission/permission.module';
import { User } from 'src/users/models/user.model';
import { UsersModule } from 'src/users/users.module';
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
  ],
})
export class JobsModule {}
