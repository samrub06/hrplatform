export class GetJobsQuery {
  constructor(
    public readonly filters?: {
      city?: string;
      work_condition?: string;
      company_type?: string;
    },
    public readonly id?: number,
  ) {}
}
