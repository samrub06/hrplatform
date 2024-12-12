import {
  Body,
  Controller,
  Delete,
  Get,
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
import { Action } from 'src/app.enum';
import { AuthGuard } from 'src/auth/auth.guards';
import { AppAbility } from 'src/casl/casl-ability.factory';
import { CheckPolicies } from 'src/casl/check-policies.decorator';
import { PoliciesGuard } from 'src/casl/policies.guard';
import { CreateAdminRequestDto } from './commands/create-admin-command.request.dto';
import { CreateAdminNoteRequestDto } from './commands/create-admin-note-command.request.dto';
import { CreateAdminNoteCommand } from './commands/create-admin-note.command';
import { CreateAdminCommand } from './commands/create-admin.command';
import { DeleteAdminNoteCommand } from './commands/delete-admin-note.command';
import { DeleteAdminCommand } from './commands/delete-admin.command';
import { UpdateAdminNoteCommand } from './commands/update-admin-note.command';
import { UpdateAdminCommand } from './commands/update-admin.command';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { Admin } from './models/admin.model';
import { GetAdminNotesQuery } from './queries/get-admin-notes.query';

@ApiTags('Admin')
@ApiBearerAuth()
@Controller('admin')
@UseGuards(AuthGuard, PoliciesGuard)
export class AdminController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create Admin' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, Admin))
  createAdmin(@Body() createAdminDto: CreateAdminRequestDto) {
    return this.commandBus.execute(new CreateAdminCommand(createAdminDto));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update Admin' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, Admin))
  updateAdmin(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.commandBus.execute(new UpdateAdminCommand(id, updateAdminDto));
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete Admin' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, Admin))
  deleteAdmin(@Param('id') id: string) {
    return this.commandBus.execute(new DeleteAdminCommand(id));
  }

  @Post('note')
  @ApiOperation({ summary: 'Create Admin Note' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, Admin))
  createAdminNote(@Body() createAdminNoteDto: CreateAdminNoteRequestDto) {
    return this.commandBus.execute(
      new CreateAdminNoteCommand(createAdminNoteDto),
    );
  }

  @Get('notes/:userId')
  @ApiOperation({ summary: 'Get Admin Notes' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Admin))
  getAdminNotes(@Param('userId') userId: string) {
    return this.queryBus.execute(new GetAdminNotesQuery(userId));
  }

  @Patch('note/:id')
  @ApiOperation({ summary: 'Update Admin Note' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, Admin))
  updateAdminNote(@Param('id') id: string, @Body('content') content: string) {
    return this.commandBus.execute(new UpdateAdminNoteCommand(id, content));
  }

  @Delete('note/:id')
  @ApiOperation({ summary: 'Delete Admin Note' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, Admin))
  deleteAdminNote(@Param('id') id: string) {
    return this.commandBus.execute(new DeleteAdminNoteCommand(id));
  }
}
