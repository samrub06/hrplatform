import { Module, forwardRef } from '@nestjs/common';

import { CqrsModule } from '@nestjs/cqrs';
import { SequelizeModule } from '@nestjs/sequelize';
import { AwsModule } from 'src/aws/aws.module';
import { AuthModule } from '../auth/auth.module';
import { CreateUserHandler } from './commands/create-user.command';
import { UpdateUserHandler } from './commands/update-user.command';
import { User } from './models/user.model';

import { PermissionModule } from 'src/permission/permission.module';
import { CreateUserValidator } from './commands/create-user.commande.validator';
import { GeneratePresignedUrlHandler } from './commands/generate-presigned-url.command';
import { GetCvDownloadUrlHandler } from './commands/get-cv-download-url-query';
import { RemoveUserHandler } from './commands/remove-user.command';
import { UpdateUserValidator } from './commands/update-user.command.validator';
import { CheckUserPermissionHandler } from './queries/check-user-permission.query';
import { GetAllUsersQueryHandler } from './queries/get-all-user.query';
import { GetUserByIdQueryHandler } from './queries/get-user-by-id.query';
import { GetUserPermissionsHandler } from './queries/get-user-permissions.query';
import { UserRepository } from './user.repository';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    SequelizeModule.forFeature([User]),
    CqrsModule,
    forwardRef(() => AuthModule),
    AwsModule,
    PermissionModule,
  ],
  controllers: [UsersController],
  providers: [
    UserRepository,
    CreateUserHandler,
    RemoveUserHandler,
    GetAllUsersQueryHandler,
    GetUserByIdQueryHandler,
    UpdateUserHandler,
    GeneratePresignedUrlHandler,
    GetCvDownloadUrlHandler,
    GetUserPermissionsHandler,
    CheckUserPermissionHandler,
    CreateUserValidator,
    UpdateUserValidator,
    UsersService,
  ],
  exports: [UserRepository],
})
export class UsersModule {}
