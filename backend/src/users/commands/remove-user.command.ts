import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersService } from '../users.service';

export class RemoveUserCommand {
  constructor(public readonly id: number) {}
}

@CommandHandler(RemoveUserCommand)
export class RemoveUserCommandHandler
  implements ICommandHandler<RemoveUserCommand>
{
  constructor(private usersService: UsersService) {}

  async execute(command: RemoveUserCommand): Promise<string> {
    const result = await this.usersService.delete(command.id);
    if (result === 0) {
      throw new NotFoundException(`User with ID ${command.id} not found.`);
    }
    return `User with ID ${command.id} has been successfully removed.`;
  }
}
