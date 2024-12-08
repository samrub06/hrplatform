import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';
import { CreateJobCommand } from './commands/create-job.command';
import { CreateJobDto } from './dto/create-job-dto';
import { UpdateJobDto } from './dto/update-job-dto';
import { RemoveJobCommand } from './handlers/remove-job.handler';
import { UpdateJobCommand } from './handlers/update-job.handler';
import { GetJobsQuery } from './queries/get-jobs-query';

@ApiTags('jobs')
@Controller('jobs')
export class JobsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  async create(@Body() createJobDto: CreateJobDto) {
    return this.commandBus.execute(new CreateJobCommand(createJobDto));
  }

  @Get()
  async findAll() {
    return this.queryBus.execute(new GetJobsQuery());
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.queryBus.execute(new GetJobsQuery(undefined, id));
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateJobDto: UpdateJobDto) {
    return this.commandBus.execute(new UpdateJobCommand(id, updateJobDto));
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.commandBus.execute(new RemoveJobCommand(id));
  }
}
