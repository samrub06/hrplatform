import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { SequelizeModule } from '@nestjs/sequelize';
import { AwsModule } from 'src/aws/aws.module';
import { CaslModule } from 'src/casl/casl.module';
import { AdminNote } from 'src/models/admin-note.model';
import { Admin } from 'src/models/admin.model';
import { CVEducation } from 'src/models/cv-education.model';
import { CVSkill } from 'src/models/cv-skill.model';
import { CV } from 'src/models/cv.model';
import { User } from 'src/models/user.model';
import { ExtractCVDataHandler } from './commands/extract-cv-data.command';
import { UpdateCVEducationCommandHandler } from './commands/update-cv-education.command';
import { UpdateCVSkillsCommandHandler } from './commands/update-cv-skills.command';
import { CVController } from './cv.controller';
import { CVRepository } from './cv.repository';
import { GetCVEducationHandler } from './queries/get-cv-education.query';
import { GetCVSkillsHandler } from './queries/get-cv-skills.query';

@Module({
  imports: [
    CqrsModule,

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
    UpdateCVSkillsCommandHandler,
    UpdateCVEducationCommandHandler,
    GetCVSkillsHandler,
    GetCVEducationHandler,
  ],
  exports: [CVRepository],
})
export class CVModule {}
