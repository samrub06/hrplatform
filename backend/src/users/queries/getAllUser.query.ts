import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/sequelize';
import { Repository } from 'sequelize-typescript';
import { User } from '../models/user.model';

export class FindAllUsersQuery implements IQuery {}

@QueryHandler(FindAllUsersQuery)
export class FindAllUsersQueryHandler
  implements IQueryHandler<FindAllUsersQuery>
{
  constructor(
    @InjectModel(User)
    private usersRepository: Repository<User>,
  ) {}

  async execute(): Promise<User[]> {
    return this.usersRepository.findAll();
  }
}
