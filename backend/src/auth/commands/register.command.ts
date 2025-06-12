import { BadRequestException, ConflictException } from '@nestjs/common';
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserRepository } from '../../users/user.repository';

import { SendWelcomeEmailCommand } from '../../notifications/commands/send-welcome-email.command';
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
    private readonly commandBus: CommandBus,
  ) {}

  async execute(command: RegisterCommand): Promise<RegisterResponseDto> {
    const { request } = command;

    // Validation métier après validation syntaxique
    const validationResult = this.validator.validate(request);
    if (!validationResult.isValid) {
      throw new BadRequestException(validationResult.errors);
    }

    const existingUser = await this.userRepository.findByEmail(request.email);
    if (existingUser) {
      throw new ConflictException('This email is already used');
    }

    const hashedPassword = await bcrypt.hash(request.password, 10);

    const newUser = await this.userRepository.create({
      email: request.email,
      password: hashedPassword,
      first_name: request.first_name,
      last_name: request.last_name,
    });

    const emailData = {
      user_id: newUser.id,
      email: newUser.email,
      first_name: newUser.first_name,
      last_name: newUser.last_name,
    };

    // send to dispatcher to send email to user
    await this.commandBus.execute(new SendWelcomeEmailCommand(emailData));

    const payload = {
      email: newUser.email,
      id: newUser.id,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
