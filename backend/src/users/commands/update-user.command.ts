import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserRepository } from '../user.repository';
import { UpdateUserRequestDto } from './update-user.command.request.dto';
import { UpdateUserValidator } from './update-user.command.validator';

export class UpdateUserCommand {
  constructor(
    public readonly id: string,
    public readonly request: UpdateUserRequestDto,
  ) {}
}

@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly validator: UpdateUserValidator,
  ) {}

  async execute(command: UpdateUserCommand) {
    const { id, request } = command;

    if (!this.validator.validate(request)) {
      throw new BadRequestException('Invalid user data');
    }

    const updatedUser = await this.userRepository.update(id, request);
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return updatedUser;
  }
}
