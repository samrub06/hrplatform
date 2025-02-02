import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { SequelizeModule } from '@nestjs/sequelize';
import { AdminModule } from './admin/admin.module';

import { AllExceptionsFilter } from './all-exceptions.filter';
import { CaslModule } from './casl/casl.module';
import { JsonValidatorMiddleware } from './common/middleware/json-validator.middleware';
import { CVModule } from './cv/cv.module';
import { JobsModule } from './jobs/jobs.module';
import { AdminNote } from './models/admin-note.model';
import { Admin } from './models/admin.model';
import { CVEducation } from './models/cv-education.model';
import { CVSkill } from './models/cv-skill.model';
import { CV } from './models/cv.model';
import { Job } from './models/job.model';
import { Permission } from './models/permission.model';
import { RolePermission } from './models/role-permission.model';
import { Role } from './models/role.model';
import { User } from './models/user.model';
import { NotificationsModule } from './notifications/notifications.module';
import { OpenAIModule } from './openai/openai.module';
import { PermissionModule } from './permission/permission.module';
import { RabbitMQModule } from './rabbitmq/rabbitmq.module';
import { RateLimitModule } from './rate-limit/rate-limit.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    UsersModule,
    JobsModule,
    CVModule,
    RateLimitModule,
    PermissionModule,
    CaslModule,
    AdminModule,
    OpenAIModule,
    NotificationsModule,
    ConfigModule.forRoot({
      envFilePath: ['.env', '.env.production'],
      isGlobal: true,
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      models: [
        Admin,
        Role,
        Permission,
        User,
        AdminNote,
        RolePermission,
        Job,
        CV,
        CVEducation,
        CVSkill,
      ],
      autoLoadModels: true,
      synchronize: true,
    }),
    RabbitMQModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JsonValidatorMiddleware).forRoutes('*');
  }
}
