import { Module } from '@nestjs/common';

import { CqrsModule } from '@nestjs/cqrs';
import { SequelizeModule } from '@nestjs/sequelize';
import { AwsModule } from 'src/aws/aws.module';
import { User } from '../models/user.model';
import { CreateUserHandler } from './commands/create-user.command';
import { UpdateUserHandler } from './commands/update-user.command';

import { CaslModule } from 'src/casl/casl.module';
import { CVSkill } from 'src/models/cv-skill.model';
import { PermissionModule } from 'src/permission/permission.module';
import { CreateUserValidator } from './commands/create-user.commande.validator';
import { GeneratePresignedUrlHandler } from './commands/generate-presigned-url.command';
import { GeneratePublicLinkHandler } from './commands/generate-public-link.command';
import { GetCvDownloadUrlHandler } from './commands/get-cv-download-url-query';
import { RemoveUserHandler } from './commands/remove-user.command';
import { UpdateUserRoleHandler } from './commands/update-user-role.command';
import { UpdateUserValidator } from './commands/update-user.command.validator';
import { CheckUserPermissionHandler } from './queries/check-user-permission.query';
import { GetAllAlumniQueryHandler } from './queries/get-all-alumni.query';
import { GetAllUsersQueryHandler } from './queries/get-all-user.query';
import { GetPublicProfileHandler } from './queries/get-public-profile.query';
import { GetUserByIdQueryHandler } from './queries/get-user-by-id.query';
import { GetUserPermissionsHandler } from './queries/get-user-permissions.query';
import { UserRepository } from './user.repository';
import { UsersController } from './users.controller';

@Module({
  imports: [
    SequelizeModule.forFeature([User, CVSkill]),
    CqrsModule,
    AwsModule,
    PermissionModule,
    CaslModule,
  ],
  controllers: [UsersController],
  providers: [
    UserRepository,
    CreateUserHandler,
    RemoveUserHandler,
    GetAllUsersQueryHandler,
    GetUserByIdQueryHandler,
    GetAllAlumniQueryHandler,
    UpdateUserHandler,
    UpdateUserRoleHandler,
    GeneratePresignedUrlHandler,
    GetCvDownloadUrlHandler,
    GetUserPermissionsHandler,
    CheckUserPermissionHandler,
    GeneratePublicLinkHandler,
    GetPublicProfileHandler,
    CreateUserValidator,
    UpdateUserValidator,
  ],
  exports: [UserRepository],
})
export class UsersModule {}
