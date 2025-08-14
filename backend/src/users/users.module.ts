import { Module } from '@nestjs/common';

import { CqrsModule } from '@nestjs/cqrs';
import { SequelizeModule } from '@nestjs/sequelize';
import { AwsModule } from '../aws/aws.module';
import { CaslModule } from '../casl/casl.module';
import { CVEducation } from '../models/cv-education.model';
import { CVExperience } from '../models/cv-experience.model';
import { CVSkill } from '../models/cv-skill.model';
import { Role } from '../models/role.model';
import { User } from '../models/user.model';
import { PermissionModule } from '../permission/permission.module';
import { CreateUserHandler } from './commands/create-user.command';
import { CreateUserValidator } from './commands/create-user.command.validator';
import { GeneratePresignedUrlHandler } from './commands/generate-presigned-url.command';
import { GeneratePublicLinkHandler } from './commands/generate-public-link.command';
import { GetCvDownloadUrlHandler } from './commands/get-cv-download-url-query';
import { RemoveUserHandler } from './commands/remove-user.command';
import { UpdateUserRoleHandler } from './commands/update-user-role.command';
import { UpdateUserHandler } from './commands/update-user.command';
import { UpdateUserValidator } from './commands/update-user.command.validator';
import { CheckUserPermissionHandler } from './queries/check-user-permission.query';
import { GetAllAlumniQueryHandler } from './queries/get-all-alumni.query';
import { GetAllUsersQueryHandler } from './queries/get-all-user.query';
import { GetPublicProfileHandler } from './queries/get-public-profile.query';
import { GetUserByIdQueryHandler } from './queries/get-user-by-id.query';
import { GetUserPermissionsHandler } from './queries/get-user-permissions.query';
import { GetUserWithCVCompleteQueryHandler } from './queries/get-user-with-cv-and-skills.query';
import { UserRepository } from './user.repository';
import { UsersController } from './users.controller';

@Module({
  imports: [
    SequelizeModule.forFeature([User, CVSkill, CVEducation, CVExperience, Role]),
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
    GetUserWithCVCompleteQueryHandler,
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
