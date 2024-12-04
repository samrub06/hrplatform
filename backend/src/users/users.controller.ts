import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { AuthGuard } from 'src/auth/auth.guards';
import { Role } from 'src/enums/role.enum';
import { Roles } from 'src/roles/roles.decorator';
import { RolesGuard } from 'src/roles/roles.guards';
import { CreateUserCommand } from './commands/create-user.command';
import { RemoveUserCommand } from './commands/remove-user.command';
import { UpdateUserCommand } from './commands/update-user.command';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindAllUsersQuery } from './queries/getAllUser.query';
import { FindUserByIdQuery } from './queries/getUserById.query';

@Controller('users')
@UseGuards(AuthGuard, RolesGuard)
export class UsersController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  @Roles(Role.ADMIN)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.commandBus.execute(new CreateUserCommand(createUserDto));
  }

  @Get()
  @Roles(Role.ADMIN)
  findAll() {
    return this.queryBus.execute(new FindAllUsersQuery());
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.queryBus.execute(new FindUserByIdQuery(+id));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.commandBus.execute(new UpdateUserCommand(+id, updateUserDto));
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commandBus.execute(new RemoveUserCommand(+id));
  }
}
