import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { SessionUser } from '../../models/sessionUser.model';
import { SessionsRepository } from '../sessions.repository';

export class GetUserSessionsQuery {
  constructor(public readonly userId: string) {}
}

@QueryHandler(GetUserSessionsQuery)
export class GetUserSessionsHandler
  implements IQueryHandler<GetUserSessionsQuery>
{
  constructor(private readonly sessionsRepository: SessionsRepository) {}

  async execute(query: GetUserSessionsQuery): Promise<SessionUser[]> {
    return this.sessionsRepository.findByUserId(query.userId);
  }
}
