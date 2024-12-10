import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { JobRepository } from '../job.repository';

export class GetJobsQuery {
  constructor(
    public readonly filters?: {
      city?: string;
      work_condition?: string;
      company_type?: string;
    },
  ) {}
}

@QueryHandler(GetJobsQuery)
export class GetJobsHandler implements IQueryHandler<GetJobsQuery> {
  constructor(private readonly jobRepository: JobRepository) {}

  async execute(query: GetJobsQuery) {
    const { filters } = query;
    return this.jobRepository.findAll(filters);
  }
}
