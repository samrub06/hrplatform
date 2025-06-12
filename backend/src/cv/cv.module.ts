import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { SequelizeModule } from '@nestjs/sequelize';
import { AwsModule } from '../aws/aws.module';
import { CaslModule } from '../casl/casl.module';
import { AdminNote } from '../models/admin-note.model';
import { Admin } from '../models/admin.model';
import { CVEducation } from '../models/cv-education.model';
import { CVSkill } from '../models/cv-skill.model';
import { CV } from '../models/cv.model';
import { User } from '../models/user.model';
import { OpenAIModule } from '../openai/openai.module';
import { ExtractCVDataHandler } from './commands/extract-cv-data.command';
import { UpdateCVEducationCommandHandler } from './commands/update-cv-education.command';
import { UpdateCVSkillsCommandHandler } from './commands/update-cv-skills.command';
import { CVController } from './cv.controller';
import { CVRepository } from './cv.repository';
import {
  GetCVEducationHandler,
  GetCVEducationQuery,
} from './queries/get-cv-education.query';
import {
  GetCVSkillsHandler,
  GetCVSkillsQuery,
} from './queries/get-cv-skills.query';

@Module({
  imports: [
    CqrsModule,
    OpenAIModule,
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
    GetCVSkillsQuery,
    GetCVEducationQuery,
  ],
  exports: [CVRepository],
})
export class CVModule {}
