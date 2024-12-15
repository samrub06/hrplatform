import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { SequelizeModule } from '@nestjs/sequelize';
import { AdminModule } from './admin/admin.module';
import { AdminNote } from './admin/models/admin-note.model';
import { Admin } from './admin/models/admin.model';
import { AllExceptionsFilter } from './all-exceptions.filter'; // Importez le filtre
import { AuthModule } from './auth/auth.module';
import { CaslModule } from './casl/casl.module';
import { JsonValidatorMiddleware } from './common/middleware/json-validator.middleware';
import { JobsModule } from './jobs/jobs.module';
import { Job } from './jobs/models/job.model';
import { Permission } from './models/permission.model';
import { RolePermission } from './models/role-permission.model';
import { Role } from './models/role.model';
import { NotificationsModule } from './notifications/notifications.module';
import { PermissionModule } from './permission/permission.module';
import { User } from './users/models/user.model';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    JobsModule,
    PermissionModule,
    CaslModule,
    AdminModule,
    NotificationsModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: +process.env.DB_PORT || 8083,
      username: process.env.DB_USER || 'samuel',
      password: process.env.DB_PASSWORD || 'root',
      database: process.env.DB_NAME || 'hrplatform',
      models: [User, Job, Admin, AdminNote, Permission, Role, RolePermission],
      synchronize: true, // should not use in production
      schema: 'public',
    }),
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
