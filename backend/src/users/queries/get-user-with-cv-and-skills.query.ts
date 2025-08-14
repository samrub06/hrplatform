import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserRepository } from '../user.repository';

export class GetUserWithCVCompleteQuery {
  constructor(public readonly id: string) {}
}

@QueryHandler(GetUserWithCVCompleteQuery)
export class GetUserWithCVCompleteQueryHandler
  implements IQueryHandler<GetUserWithCVCompleteQuery>
{
  constructor(private readonly userRepository: UserRepository) {}

  async execute(query: GetUserWithCVCompleteQuery) {
    const user = await this.userRepository.findByIdWithCVAndSkills(query.id);
    if (!user) {
      throw new NotFoundException(`User with ID ${query.id} not found`);
    }
    return user;
  }
} 