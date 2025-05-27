import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { SessionUser } from '../../models/sessionUser.model';
import { SessionsRepository } from '../sessions.repository';

export class GetSessionQuery {
  constructor(public readonly sessionId: string) {}
}

@QueryHandler(GetSessionQuery)
export class GetSessionHandler implements IQueryHandler<GetSessionQuery> {
  constructor(private readonly sessionsRepository: SessionsRepository) {}

  async execute(query: GetSessionQuery): Promise<SessionUser | null> {
    return this.sessionsRepository.findById(query.sessionId);
  }
}
