import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { SequelizeModule } from '@nestjs/sequelize';
import { AdminController } from './admin.controller';
import { AdminRepository } from './admin.repository';
import { CreateAdminHandler } from './commands/create-admin.command';
import { CreateAdminValidator } from './commands/create-admin.command.validator';
import { AdminNote } from './models/admin-note.model';
import { Admin } from './models/admin.model';
import { GetAdminNotesHandler } from './queries/get-admin-notes.query';

const CommandHandlers = [CreateAdminHandler];
const QueryHandlers = [GetAdminNotesHandler];

@Module({
  imports: [CqrsModule, SequelizeModule.forFeature([Admin, AdminNote])],
  controllers: [AdminController],
  providers: [
    AdminRepository,
    ...CommandHandlers,
    CreateAdminValidator,
    ...QueryHandlers,
  ],
})
export class AdminModule {}
