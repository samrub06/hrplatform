import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Job } from '../models/job.model';
import { CreateJobDto } from './dto/create-job-dto';
import { UpdateJobDto } from './dto/update-job-dto';

@Injectable()
export class JobRepository {
  constructor(
    @InjectModel(Job)
    private jobModel: typeof Job,
  ) {}

  async create(createJobDto: CreateJobDto): Promise<Job> {
    return this.jobModel.create({
      ...createJobDto,
    });
  }

  async findAll(filters?: any): Promise<Job[]> {
    return this.jobModel.findAll({
      where: filters,
      order: [['createdAt', 'DESC']],
    });
  }

  async findById(id: string): Promise<Job | null> {
    return this.jobModel.findByPk(id);
  }

  async update(id: string, updateJobDto: UpdateJobDto): Promise<Job | null> {
    const job = await this.findById(id);
    if (!job) return null;
    return job.update(updateJobDto);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.jobModel.destroy({ where: { id } });
    return result > 0;
  }

  async findAndCountAll(offset: number, limit: number) {
    return this.jobModel.findAll({
      offset,
      limit,
      order: [['createdAt', 'DESC']],
    });
  }

  async count(): Promise<number> {
    return this.jobModel.count();
  }
}
