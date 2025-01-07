import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserRepository } from '../user.repository';

export class GetUserByIdQueryCommand {
  constructor(public readonly id: string) {}
}

@QueryHandler(GetUserByIdQueryCommand)
export class GetUserByIdQueryHandler
  implements IQueryHandler<GetUserByIdQueryCommand>
{
  constructor(private readonly userRepository: UserRepository) {}

  async execute(query: GetUserByIdQueryCommand) {
    const user = await this.userRepository.findById(query.id);
    if (!user) {
      throw new NotFoundException(`User with ID ${query.id} not found`);
    }
    return user;
  }
}
