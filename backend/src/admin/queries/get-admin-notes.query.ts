import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { AdminRepository } from '../admin.repository';

export class GetAdminNotesQuery {
  constructor(public readonly userId: string) {}
}

@QueryHandler(GetAdminNotesQuery)
export class GetAdminNotesHandler implements IQueryHandler<GetAdminNotesQuery> {
  constructor(private readonly adminRepository: AdminRepository) {}

  async execute(query: GetAdminNotesQuery) {
    const { userId } = query;
    return this.adminRepository.findAllNotes(userId);
  }
}
