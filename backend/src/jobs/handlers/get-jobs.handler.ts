import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/sequelize';
import { Job } from '../models/job.model';
import { GetJobsQuery } from '../queries/get-jobs-query';

@QueryHandler(GetJobsQuery)
export class GetJobsHandler implements IQueryHandler<GetJobsQuery> {
  constructor(
    @InjectModel(Job)
    private jobModel: typeof Job,
  ) {}

  async execute(query: GetJobsQuery): Promise<Job[]> {
    const where: any = {};

    if (query.filters) {
      if (query.filters.city) {
        where.city = query.filters.city;
      }
      if (query.filters.work_condition) {
        where.work_condition = query.filters.work_condition;
      }
      if (query.filters.company_type) {
        where.company_type = query.filters.company_type;
      }
    }

    return this.jobModel.findAll({
      where,
      order: [['createdAt', 'DESC']],
    });
  }
}
