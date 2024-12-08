import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateJobDto } from './dto/create-job-dto';
import { UpdateJobDto } from './dto/update-job-dto';
import { Job } from './models/job.model';

@Injectable()
export class JobsService {
  constructor(
    @InjectModel(Job)
    private jobModel: typeof Job,
  ) {}

  async create(createJobDto: CreateJobDto): Promise<Job> {
    return this.jobModel.create({ ...createJobDto });
  }

  async findAll(): Promise<Job[]> {
    return this.jobModel.findAll();
  }

  async findOne(id: number): Promise<Job> {
    const job = await this.jobModel.findOne({ where: { id } });
    if (!job) {
      throw new NotFoundException(`Job with ID ${id} not found`);
    }
    return job;
  }

  async update(id: number, updateJobDto: UpdateJobDto): Promise<Job> {
    const job = await this.findOne(id);
    await job.update(updateJobDto);
    return job;
  }

  async remove(id: number): Promise<void> {
    const job = await this.findOne(id);
    await job.destroy();
  }
}
