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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateAdminRequestDto } from './commands/create-admin-command.request.dto';
import { CreateAdminNoteRequestDto } from './commands/create-admin-note-command.request.dto';
import { CreateAdminNoteCommand } from './commands/create-admin-note.command';
import { CreateAdminCommand } from './commands/create-admin.command';
import { DeleteAdminNoteCommand } from './commands/delete-admin-note.command';
import { DeleteAdminCommand } from './commands/delete-admin.command';
import { UpdateAdminNoteCommand } from './commands/update-admin-note.command';
import { UpdateAdminCommand } from './commands/update-admin.command';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { GetAdminNotesQuery } from './queries/get-admin-notes.query';

@ApiTags('Admin')
@ApiBearerAuth()
@Controller('admin')
export class AdminController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create Admin' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  createAdmin(@Body() createAdminDto: CreateAdminRequestDto) {
    return this.commandBus.execute(new CreateAdminCommand(createAdminDto));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update Admin' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  updateAdmin(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.commandBus.execute(new UpdateAdminCommand(id, updateAdminDto));
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete Admin' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  deleteAdmin(@Param('id') id: string) {
    return this.commandBus.execute(new DeleteAdminCommand(id));
  }

  @Post('note')
  @ApiOperation({ summary: 'Create Admin Note' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  createAdminNote(@Body() createAdminNoteDto: CreateAdminNoteRequestDto) {
    return this.commandBus.execute(
      new CreateAdminNoteCommand(createAdminNoteDto),
    );
  }

  @Get('notes/:userId')
  @ApiOperation({ summary: 'Get Admin Notes' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  getAdminNotes(@Param('userId') userId: string) {
    return this.queryBus.execute(new GetAdminNotesQuery(userId));
  }

  @Patch('note/:id')
  @ApiOperation({ summary: 'Update Admin Note' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  updateAdminNote(@Param('id') id: string, @Body('content') content: string) {
    return this.commandBus.execute(new UpdateAdminNoteCommand(id, content));
  }

  @Delete('note/:id')
  @ApiOperation({ summary: 'Delete Admin Note' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  deleteAdminNote(@Param('id') id: string) {
    return this.commandBus.execute(new DeleteAdminNoteCommand(id));
  }
}
