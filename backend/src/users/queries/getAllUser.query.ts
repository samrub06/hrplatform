import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserRepository } from '../user.repository';

export class GetAllUsersQueryCommand {
  constructor(public readonly filters: any = {}) {}
}

@QueryHandler(GetAllUsersQueryCommand)
export class GetAllUsersQueryHandler
  implements IQueryHandler<GetAllUsersQueryCommand>
{
  constructor(private readonly userRepository: UserRepository) {}

  async execute(query: GetAllUsersQueryCommand) {
    return this.userRepository.findAll(query.filters);
  }
}
