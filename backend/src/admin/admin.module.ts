import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from 'src/auth/auth.module';
import { CaslModule } from 'src/casl/casl.module';
import { PermissionModule } from 'src/permission/permission.module';
import { UsersModule } from 'src/users/users.module';
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
  imports: [
    CqrsModule,
    AuthModule,
    PermissionModule,
    UsersModule,
    CaslModule,
    SequelizeModule.forFeature([Admin, AdminNote]),
  ],
  controllers: [AdminController],
  providers: [
    AdminRepository,
    ...CommandHandlers,
    CreateAdminValidator,
    ...QueryHandlers,
  ],
  exports: [AdminRepository],
})
export class AdminModule {}
