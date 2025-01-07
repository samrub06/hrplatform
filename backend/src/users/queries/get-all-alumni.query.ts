import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserRepository } from '../user.repository';

export class GetAllAlumniQuery {
  constructor() {}
}

@QueryHandler(GetAllAlumniQuery)
export class GetAllAlumniQueryHandler
  implements IQueryHandler<GetAllAlumniQuery>
{
  constructor(private readonly userRepository: UserRepository) {}

  async execute(): Promise<any> {
    const alumni = await this.userRepository.findAllAlumni();
    if (!alumni || alumni.length === 0) {
      return [];
    }
    return alumni;
  }
}
