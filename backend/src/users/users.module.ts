import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';

import { CqrsModule } from '@nestjs/cqrs';
import { SequelizeModule } from '@nestjs/sequelize';
import { AwsModule } from 'src/aws/aws.module';
import { PermissionService } from 'src/permission/permission.service';
import { AuthModule } from '../auth/auth.module';
import { CreateUserCommand } from './commands/create-user.command';
import { UpdateUserCommand } from './commands/update-user.command';
import { User } from './models/user.model';

import { RemoveUserCommand } from './commands/remove-user.command';
import { GetAllUsersQueryCommand } from './queries/getAllUser.query';
import { GetUserByIdQueryCommand } from './queries/getUserById.query';
import { UsersController } from './users.controller';

@Module({
  imports: [
    SequelizeModule.forFeature([User]),
    CqrsModule,
    forwardRef(() => AuthModule),
    AwsModule,
  ],
  controllers: [UsersController],
  providers: [
    CreateUserCommand,
    RemoveUserCommand,
    GetAllUsersQueryCommand,
    GetUserByIdQueryCommand,
    UpdateUserCommand,
    UsersService,
    PermissionService,
  ],
  exports: [UsersService],
})
export class UsersModule {}
