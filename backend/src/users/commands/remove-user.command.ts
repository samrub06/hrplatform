import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserRepository } from '../user.repository';

export class RemoveUserCommand {
  constructor(public readonly id: string) {}
}

@CommandHandler(RemoveUserCommand)
export class RemoveUserHandler implements ICommandHandler<RemoveUserCommand> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(command: RemoveUserCommand): Promise<string> {
    const { id } = command;

    const deleted = await this.userRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return `User with ID ${id} has been successfully removed`;
  }
}
