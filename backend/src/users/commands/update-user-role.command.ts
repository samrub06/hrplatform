import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserRepository } from '../user.repository';

export class UpdateUserRoleCommand {
  constructor(
    public readonly id: string,
    public readonly role: string,
  ) {}
}

@CommandHandler(UpdateUserRoleCommand)
export class UpdateUserRoleHandler
  implements ICommandHandler<UpdateUserRoleCommand>
{
  constructor(private readonly userRepository: UserRepository) {}

  async execute(command: UpdateUserRoleCommand) {
    const { id, role } = command;

    // Assign Role to the user
    const updatedUser = await this.userRepository.updateRole(id, role);
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return updatedUser;
  }
}
