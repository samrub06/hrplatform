import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Action } from '../app.enum';
import { AuthGuard } from '../auth/auth.guards';
import { AppAbility } from '../casl/casl-ability.factory';
import { CheckPolicies } from '../casl/check-policies.decorator';
import { PoliciesGuard } from '../casl/policies.guard';
import { Job } from '../models/job.model';
import { CreateJobRequestDto } from './commands/create-job-command.request.dto';
import { CreateJobCommand } from './commands/create-job.command';
import { DeleteJobCommand } from './commands/delete-job.command';
import { UpdateJobCommand } from './commands/update-job.command';
import { UpdateJobDto } from './dto/update-job-dto';
import { GetJobsQuery } from './queries/get-jobs-query';

@ApiTags('Jobs')
@ApiBearerAuth()
@Controller('jobs')
@UseGuards(AuthGuard, PoliciesGuard)
export class JobsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create Job' })
  @ApiResponse({ status: 403, description: 'Forbidden Access.' })
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, Job))
  createJob(@Body() createJobRequestDto: CreateJobRequestDto) {
    return this.commandBus.execute(new CreateJobCommand(createJobRequestDto));
  }

  @Post('search')
  @ApiOperation({ summary: 'Get All Jobs' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Job))
  findAllJobs(@Body() { page, size }: { page: number; size: number }) {
    const query = new GetJobsQuery(page, size);
    return this.queryBus.execute(query);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update Job By Id' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, Job))
  updateJob(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto) {
    return this.commandBus.execute(new UpdateJobCommand(id, updateJobDto));
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete Job By Id' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, Job))
  deleteJob(@Param('id') id: string) {
    return this.commandBus.execute(new DeleteJobCommand(id));
  }
}
