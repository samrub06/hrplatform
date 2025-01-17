import { forwardRef, Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { AdminModule } from 'src/admin/admin.module';
import { RefreshToken } from 'src/models/token.model';
import { RabbitMQModule } from 'src/rabbitmq/rabbitmq.module';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guards';
import { LoginAdminHandler } from './commands/login-admin.command';
import { LoginHandler } from './commands/login.command';
import { LoginValidator } from './commands/login.command.validator';
import { RefreshTokenHandler } from './commands/refresh-token.command';
import { RegisterAdminHandler } from './commands/register-admin.command';
import { RegisterHandler } from './commands/register.command';
import { RegisterValidator } from './commands/register.command.validator';
import { RevokeUserTokensHandler } from './commands/revoke-token.command';
import { RefreshTokenRepository } from './refresh-token.repository';
import { GoogleStrategy } from './strategies/google.strategy';

const CommandHandlers = [
  LoginHandler,
  LoginAdminHandler,
  RefreshTokenHandler,
  RegisterAdminHandler,
  RegisterHandler,
  RefreshTokenHandler,
  RevokeUserTokensHandler,
];
const Validators = [LoginValidator, RegisterValidator];

@Global()
@Module({
  imports: [
    CqrsModule,
    ConfigModule,
    RabbitMQModule,
    forwardRef(() => UsersModule),
    forwardRef(() => AdminModule),
    SequelizeModule.forFeature([RefreshToken]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '3h' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    GoogleStrategy,
    RefreshTokenRepository,
    ...CommandHandlers,
    ...Validators,
    {
      provide: 'APP_GUARD',
      useClass: AuthGuard,
    },
  ],
  exports: [JwtModule],
})
export class AuthModule {}
