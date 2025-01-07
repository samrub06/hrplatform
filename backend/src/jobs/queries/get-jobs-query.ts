import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { JobRepository } from '../job.repository';

export class GetJobsQuery {
  constructor(
    public readonly page: number = 1,
    public readonly size: number = 10,
  ) {}
}

@QueryHandler(GetJobsQuery)
export class GetJobsHandler implements IQueryHandler<GetJobsQuery> {
  constructor(private readonly jobRepository: JobRepository) {}

  async execute(query: GetJobsQuery) {
    const { page, size } = query;
    const offset = (page - 1) * size;

    const [jobs, total] = await Promise.all([
      this.jobRepository.findAndCountAll(offset, size),
      this.jobRepository.count(),
    ]);

    return {
      pagination: {
        page,
        size,
        total_pages: Math.ceil(total / size),
        total,
      },
      results: jobs,
    };
  }
}
