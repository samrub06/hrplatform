import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../models/user.model';
import { UsersService } from '../users.service';

export class UpdateUserCommand {
  constructor(
    public readonly id: number,
    public updateUserDto: UpdateUserDto,
  ) {}
}

@CommandHandler(UpdateUserCommand)
export class UpdateUserCommandHandler
  implements ICommandHandler<UpdateUserCommand>
{
  constructor(private usersService: UsersService) {}

  async execute(command: UpdateUserCommand): Promise<User> {
    const user = await this.usersService.findOne(command.id);
    if (!user) {
      throw new NotFoundException(`User with ID ${command.id} not found.`);
    }
    await this.usersService.update(command.id, command.updateUserDto);
    const updatedUser: User = {
      ...user,
      ...command.updateUserDto,
    } as unknown as User;
    return updatedUser;
  }
}
