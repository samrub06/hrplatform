import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { SequelizeModule } from '@nestjs/sequelize';
import { SessionUser } from '../models/sessionUser.model';
import { User } from '../models/user.model';
import { CreateSessionHandler } from './commands/create-session.command';
import { DeleteSessionHandler } from './commands/delete-session.command';
import { UpdateSessionHandler } from './commands/update-session.command';
import { GetUserSessionsHandler } from './queries/get-user-sessions.query';
import { SessionsController } from './sessions.controller';
import { SessionsRepository } from './sessions.repository';

const CommandHandlers = [
  CreateSessionHandler,
  UpdateSessionHandler,
  DeleteSessionHandler,
];

const QueryHandlers = [GetUserSessionsHandler];

@Module({
  imports: [CqrsModule, SequelizeModule.forFeature([SessionUser, User])],
  controllers: [SessionsController],
  providers: [SessionsRepository, ...CommandHandlers, ...QueryHandlers],
  exports: [SessionsRepository],
})
export class SessionsModule {}
