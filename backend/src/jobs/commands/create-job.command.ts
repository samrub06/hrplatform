import { CreateJobDto } from '../dto/create-job-dto';

export class CreateJobCommand {
  constructor(public readonly createJobDto: CreateJobDto) {}
}
