import {
  Body,
  Controller,
  Delete,
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
import { AuthGuard } from '../auth/auth.guards';
import { CreateSessionCommand } from './commands/create-session.command';
import { DeleteSessionCommand } from './commands/delete-session.command';
import { UpdateSessionCommand } from './commands/update-session.command';
import { GetSessionQuery } from './queries/get-session.query';
import { GetUserSessionsQuery } from './queries/get-user-sessions.query';

@ApiTags('sessions')
@Controller('sessions')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class SessionsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new session' })
  @ApiResponse({ status: 201, description: 'Session created successfully' })
  async createSession(@Body() command: CreateSessionCommand) {
    return this.commandBus.execute(command);
  }

  @Post('verify/session/:sessionId')
  @ApiOperation({ summary: 'Verify a user session by ID' })
  @ApiResponse({ status: 200, description: 'Session found' })
  async getSession(@Body() command: GetSessionQuery) {
    return this.queryBus.execute(command);
  }

  @Post('session/:userId')
  @ApiOperation({ summary: 'Get all sessions for a user' })
  @ApiResponse({ status: 200, description: 'Sessions found' })
  async getUserSessions(@Body() command: GetUserSessionsQuery) {
    return this.queryBus.execute(command);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a session' })
  @ApiResponse({ status: 200, description: 'Session updated successfully' })
  async updateSession(@Body() command: UpdateSessionCommand) {
    return this.commandBus.execute(command);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a session' })
  @ApiResponse({ status: 200, description: 'Session deleted successfully' })
  async deleteSession(@Body() command: DeleteSessionCommand) {
    return this.commandBus.execute(command);
  }
}
