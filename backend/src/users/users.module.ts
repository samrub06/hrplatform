import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';

import { CqrsModule } from '@nestjs/cqrs';
import { SequelizeModule } from '@nestjs/sequelize';
import { AwsModule } from 'src/aws/aws.module';
import { AuthModule } from '../auth/auth.module';
import { User } from '../users/models/user.model';
import { CreateUserCommandHandler } from './commands/create-user.command';
import { RemoveUserCommandHandler } from './commands/remove-user.command';
import { UpdateUserCommandHandler } from './commands/update-user.command';
import { FindAllUsersQueryHandler } from './queries/getAllUser.query';
import { FindUserByIdQueryHandler } from './queries/getUserById.query';
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
    CreateUserCommandHandler,
    RemoveUserCommandHandler,
    FindUserByIdQueryHandler,
    FindAllUsersQueryHandler,
    UpdateUserCommandHandler,
    UsersService,
  ],
  exports: [UsersService],
})
export class UsersModule {}
