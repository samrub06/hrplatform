import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { RabbitMQModule } from 'src/rabbitmq/rabbitmq.module';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { LoginHandler } from './commands/login.command';
import { LoginValidator } from './commands/login.command.validator';
import { RegisterHandler } from './commands/register.command';
import { RegisterValidator } from './commands/register.command.validator';

const CommandHandlers = [LoginHandler, RegisterHandler];
const Validators = [LoginValidator, RegisterValidator];

@Module({
  imports: [
    CqrsModule,
    ConfigModule,
    RabbitMQModule,
    forwardRef(() => UsersModule),
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
  providers: [...CommandHandlers, ...Validators],
  exports: [JwtModule],
})
export class AuthModule {}
