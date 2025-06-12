import {
  Body,
  Controller,
  Param,
  Post,
  Put,
  UseGuards,
  ValidationPipe,
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
import { CV } from '../models/cv.model';
import { ExtractCVDataCommand } from './commands/extract-cv-data.command';
import { UpdateCVEducationCommand } from './commands/update-cv-education.command';
import { UpdateCVEducationRequestDto } from './commands/update-cv-education.request.command.dto';
import { UpdateCVSkillsCommand } from './commands/update-cv-skills.command';
import { UpdateCVSkillsRequestDto } from './commands/update-cv-skills.command.requet.dto';
import { GetCVEducationQuery } from './queries/get-cv-education.query';
import { GetCVSkillsQuery } from './queries/get-cv-skills.query';

@ApiTags('CV')
@ApiBearerAuth()
@Controller('cv')
export class CVController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('extract')
  @UseGuards(AuthGuard, PoliciesGuard)
  @ApiOperation({ summary: 'Extract CV Data' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, CV))
  async extractCVData(@Body() body: { userId: string; fileName: string }) {
    return this.commandBus.execute(
      new ExtractCVDataCommand(body.userId, body.fileName),
    );
  }

  //getSkills query
  @Post('skills/:id')
  @UseGuards(AuthGuard, PoliciesGuard)
  @ApiOperation({ summary: 'Get CV Skills' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, CV))
  async getCVSkills(@Param('id') id: string) {
    return this.queryBus.execute(new GetCVSkillsQuery(id));
  }

  // update skills
  @Put('update-skills/:id')
  @UseGuards(AuthGuard, PoliciesGuard)
  @ApiOperation({ summary: 'Update CV Skills' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid skill data.',
  })
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, CV))
  async updateCVSkills(
    @Param('id') id: string,
    @Body(new ValidationPipe({ transform: true }))
    body: {
      skills: UpdateCVSkillsRequestDto[];
    },
  ) {
    return this.commandBus.execute(new UpdateCVSkillsCommand(id, body.skills));
  }

  //get Education query
  @Post('education/:id')
  @UseGuards(AuthGuard, PoliciesGuard)
  @ApiOperation({ summary: 'Get CV Education' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, CV))
  async getCVEducation(@Param('id') id: string) {
    return this.queryBus.execute(new GetCVEducationQuery(id));
  }

  //update cv_education
  @Put('update-education/:id')
  @UseGuards(AuthGuard, PoliciesGuard)
  @ApiOperation({ summary: 'Update CV Education' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, CV))
  async updateCVEducation(
    @Param('id')
    id: string,
    @Body(new ValidationPipe({ transform: true }))
    body: {
      education: UpdateCVEducationRequestDto[];
    },
  ) {
    return this.commandBus.execute(
      new UpdateCVEducationCommand(id, body.education),
    );
  }
}
