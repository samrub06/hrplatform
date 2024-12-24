import { forwardRef, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { SequelizeModule } from '@nestjs/sequelize';
import { AdminModule } from 'src/admin/admin.module';
import { AdminRepository } from 'src/admin/admin.repository';
import { AdminNote } from 'src/admin/models/admin-note.model';
import { Admin } from 'src/admin/models/admin.model';
import { AuthModule } from 'src/auth/auth.module';
import { AwsModule } from 'src/aws/aws.module';
import { CaslModule } from 'src/casl/casl.module';
import { User } from 'src/users/models/user.model';
import { UserRepository } from 'src/users/user.repository';
import { ExtractCVDataHandler } from './commands/extract-cv-data.command';
import { CVController } from './cv.controller';
import { CVRepository } from './cv.repository';
import { CVEducation } from './models/cv-education.model';
import { CVSkill } from './models/cv-skill.model';
import { CV } from './models/cv.model';

@Module({
  imports: [
    CqrsModule,
    forwardRef(() => AuthModule),
    forwardRef(() => AdminModule),
    SequelizeModule.forFeature([
      CV,
      Admin,
      User,
      AdminNote,
      CVEducation,
      CVSkill,
    ]),
    AwsModule,
    CaslModule,
  ],
  controllers: [CVController],
  providers: [
    CVRepository,
    ExtractCVDataHandler,
    AdminRepository,
    UserRepository,
  ],
  exports: [CVRepository],
})
export class CVModule {}
