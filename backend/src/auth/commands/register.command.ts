import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserRepository } from '../../users/user.repository';

import {
  RABBITMQ_EXCHANGES,
  RABBITMQ_ROUTING_KEYS,
} from 'src/rabbitmq/rabbitmq.config';
import { RabbitMQService } from 'src/rabbitmq/rabbitmq.service';
import { RegisterRequestDto } from '../dto/register.request.dto';
import { RegisterResponseDto } from '../dto/register.response.dto';
import { RegisterValidator } from './register.command.validator';

export class RegisterCommand {
  constructor(public readonly request: RegisterRequestDto) {}
}

@CommandHandler(RegisterCommand)
export class RegisterHandler
  implements ICommandHandler<RegisterCommand, RegisterResponseDto>
{
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly validator: RegisterValidator,
    private readonly rabbitMQService: RabbitMQService,
  ) {}

  async execute(command: RegisterCommand): Promise<RegisterResponseDto> {
    const { request } = command;

    if (!this.validator.validate(request)) {
      throw new UnauthorizedException("Données d'inscription invalides");
    }

    const existingUser = await this.userRepository.findByEmail(request.email);
    if (existingUser) {
      throw new ConflictException('Cet email est déjà utilisé');
    }

    const hashedPassword = await bcrypt.hash(request.password, 10);

    const newUser = await this.userRepository.create({
      email: request.email,
      password: hashedPassword,
      first_name: request.first_name,
      last_name: request.last_name,
    });

    await this.rabbitMQService.publishToExchange(
      RABBITMQ_EXCHANGES.USER_EVENTS,
      RABBITMQ_ROUTING_KEYS.USER_CREATED,
      {
        userId: newUser.id,
        email: newUser.email,
        event: 'NEW_USER_REGISTERED',
        timestamp: new Date().toISOString(),
        firstName: newUser.first_name,
        lastName: newUser.last_name,
      },
    );

    const payload = {
      email: newUser.email,
      sub: newUser.id,
      roleId: newUser.roleId,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}