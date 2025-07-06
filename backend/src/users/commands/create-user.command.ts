import { BadRequestException, ConflictException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserRepository } from '../user.repository';
import { CreateUserRequestDto } from './create-user.command.request.dto';
import { CreateUserResponseDto } from './create-user.command.response.dto';
import { CreateUserValidator } from './create-user.command.validator';
export class CreateUserCommand {
  constructor(public readonly request: CreateUserRequestDto) {}
}

@CommandHandler(CreateUserCommand)
export class CreateUserHandler
  implements ICommandHandler<CreateUserCommand, CreateUserResponseDto>
{
  constructor(
    private readonly userRepository: UserRepository,
    private readonly validator: CreateUserValidator,
  ) {}

  async execute(command: CreateUserCommand): Promise<CreateUserResponseDto> {
    const { request } = command;

    if (!this.validator.validate(request)) {
      throw new BadRequestException('Invalid user data');
    }

    const existingUser = await this.userRepository.findByEmail(request.email);
    if (existingUser) {
      throw new ConflictException(`Email ${request.email} already exists`);
    }

    const user = await this.userRepository.create(request);
    return user;
  }
}
