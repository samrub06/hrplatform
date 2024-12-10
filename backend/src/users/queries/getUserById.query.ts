import { NotFoundException } from '@nestjs/common';
import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/sequelize';
import { Repository } from 'sequelize-typescript';
import { User } from '../models/user.model';

export class FindUserByIdQuery implements IQuery {
  constructor(public readonly id: string) {}
}

@QueryHandler(FindUserByIdQuery)
export class FindUserByIdQueryHandler
  implements IQueryHandler<FindUserByIdQuery>
{
  constructor(
    @InjectModel(User)
    private usersRepository: Repository<User>,
  ) {}

  async execute(query: FindUserByIdQuery): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id: query.id },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${query.id} not found.`);
    }
    return user;
  }
}
