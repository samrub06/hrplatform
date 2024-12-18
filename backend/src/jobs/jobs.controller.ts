import {
  Body,
  Controller,
  Delete,
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
import { Action } from 'src/app.enum';
import { AuthGuard } from 'src/auth/auth.guards';
import { AppAbility } from 'src/casl/casl-ability.factory';
import { CheckPolicies } from 'src/casl/check-policies.decorator';
import { PoliciesGuard } from 'src/casl/policies.guard';
import { CreateJobRequestDto } from './commands/create-job-command.request.dto';
import { CreateJobCommand } from './commands/create-job.command';
import { DeleteJobCommand } from './commands/delete-job.command';
import { UpdateJobCommand } from './commands/update-job.command';
import { UpdateJobDto } from './dto/update-job-dto';
import { Job } from './models/job.model';
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
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, Job))
  createJob(@Body() createJobRequestDto: CreateJobRequestDto) {
    return this.commandBus.execute(new CreateJobCommand(createJobRequestDto));
  }

  @Get()
  @ApiOperation({ summary: 'Get All Jobs' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Job))
  findAllJobs(@Query() filters?: any) {
    return this.queryBus.execute(new GetJobsQuery(filters));
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
