import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateJobCommand } from './commands/create-job.command';
import { UpdateJobCommand } from './commands/update-job.command';
import { CreateJobDto } from './dto/create-job-dto';
import { UpdateJobDto } from './dto/update-job-dto';
import { GetJobsQuery } from './queries/get-jobs-query';

@Controller('jobs')
export class JobsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  create(@Body() createJobDto: CreateJobDto) {
    return this.commandBus.execute(new CreateJobCommand(createJobDto));
  }

  @Get()
  findAll(@Query() filters?: any) {
    return this.queryBus.execute(new GetJobsQuery(filters));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto) {
    return this.commandBus.execute(new UpdateJobCommand(id, updateJobDto));
  }
}
