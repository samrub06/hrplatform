import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { User } from '../../users/models/user.model';
import { CreateUserDto } from '../dto/create-user.dto';
import { UsersService } from '../users.service';

export class CreateUserCommand {
  constructor(public readonly createUserDto: CreateUserDto) {}
}

@CommandHandler(CreateUserCommand)
export class CreateUserCommandHandler
  implements ICommandHandler<CreateUserCommand>
{
  constructor(private usersService: UsersService) {}

  async execute(command: CreateUserCommand): Promise<User> {
    const { createUserDto } = command;
    return this.usersService.create(createUserDto);
  }
}
