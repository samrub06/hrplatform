import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guards';
import { PermissionGuard } from 'src/permission/permission.guard';
import { RequirePermission } from 'src/permission/require-permission.decorator';
import { CreateJobCommand } from './commands/create-job.command';
import { UpdateJobCommand } from './commands/update-job.command';
import { CreateJobDto } from './dto/create-job-dto';
import { UpdateJobDto } from './dto/update-job-dto';
import { GetJobsQuery } from './queries/get-jobs-query';

@ApiTags('Jobs')
@ApiBearerAuth()
@Controller('jobs')
@UseGuards(AuthGuard, PermissionGuard)
export class JobsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create Job' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @RequirePermission('Job', 'create')
  createJob(@Body() createJobDto: CreateJobDto) {
    return this.commandBus.execute(new CreateJobCommand(createJobDto));
  }

  @Get()
  @ApiOperation({ summary: 'Get All Jobs' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @RequirePermission('Job', 'read')
  findAllJobs(@Query() filters?: any) {
    return this.queryBus.execute(new GetJobsQuery(filters));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update Job By Id' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @RequirePermission('Job', 'edit')
  updateJob(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto) {
    return this.commandBus.execute(new UpdateJobCommand(id, updateJobDto));
  }
}
