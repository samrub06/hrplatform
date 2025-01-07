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
import { RabbitMQService } from 'src/rabbitmq/rabbitmq.service';
import { ExtractCVDataHandler } from './commands/extract-cv-data.command';
import { CVController } from './cv.controller';
import { CVRepository } from './cv.repository';

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
  providers: [CVRepository, ExtractCVDataHandler, RabbitMQService],
  exports: [CVRepository],
})
export class CVModule {}
