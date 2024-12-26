import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
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
import { CV } from 'src/models/cv.model';
import { ExtractCVDataCommand } from './commands/extract-cv-data.command';

@ApiTags('CV')
@ApiBearerAuth()
@Controller('cv')
export class CVController {
  constructor(private readonly commandBus: CommandBus) {}

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
}
