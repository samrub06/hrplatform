import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { AdminModule } from 'src/admin/admin.module';
import { RabbitMQModule } from 'src/rabbitmq/rabbitmq.module';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginAdminHandler } from './commands/login-admin.command';
import { LoginHandler } from './commands/login.command';
import { LoginValidator } from './commands/login.command.validator';
import { RegisterAdminHandler } from './commands/register-admin.command';
import { RegisterHandler } from './commands/register.command';
import { RegisterValidator } from './commands/register.command.validator';
import { GoogleStrategy } from './strategies/google.strategy';

const CommandHandlers = [
  LoginHandler,
  LoginAdminHandler,
  RegisterAdminHandler,
  RegisterHandler,
];
const Validators = [LoginValidator, RegisterValidator];

@Module({
  imports: [
    CqrsModule,
    ConfigModule,
    RabbitMQModule,
    forwardRef(() => UsersModule),
    forwardRef(() => AdminModule),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '24h' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [GoogleStrategy, AuthService, ...CommandHandlers, ...Validators],
  exports: [JwtModule],
})
export class AuthModule {}
