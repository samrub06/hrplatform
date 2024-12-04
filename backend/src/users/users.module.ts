import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';

import { CqrsModule } from '@nestjs/cqrs';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from '../auth/auth.module';
import { CreateUserCommandHandler } from './commands/create-user.command';
import { RemoveUserCommandHandler } from './commands/remove-user.command';
import { UpdateUserCommandHandler } from './commands/update-user.command';
import { User } from './models/user.model';
import { FindAllUsersQueryHandler } from './queries/getAllUser.query';
import { FindUserByIdQueryHandler } from './queries/getUserById.query';
import { UsersController } from './users.controller';

@Module({
  imports: [
    SequelizeModule.forFeature([User]),
    CqrsModule,
    forwardRef(() => AuthModule),
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
