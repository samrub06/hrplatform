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
import { AuthGuard } from 'src/auth/auth.guards';
import { PermissionGuard } from 'src/permission/permission.guard';
import { RequirePermission } from 'src/permission/require-permission.decorator';
import { CreateUserCommand } from './commands/create-user.command';
import { CreateUserRequestDto } from './commands/create-user.command.request.dto';
import { GeneratePresignedUrlCommand } from './commands/generate-presigned-url.command';
import { GeneratePresignedUrlRequestDto } from './commands/generate-presigned-url.command.request.dto';
import { GetCvDownloadUrlQuery } from './commands/get-cv-download-url-query';
import { RemoveUserCommand } from './commands/remove-user.command';
import { UpdateUserCommand } from './commands/update-user.command';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './models/user.model';
import { CheckUserPermissionQuery } from './queries/check-user-permission.query';
import { GetAllUsersQueryCommand } from './queries/get-all-user.query';
import { GetUserByIdQueryCommand } from './queries/get-user-by-id.query';
import { GetUserPermissionsQuery } from './queries/get-user-permissions.query';

@ApiTags('User')
@ApiBearerAuth()
@Controller('user')
@UseGuards(AuthGuard, PermissionGuard)
export class UsersController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create User' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  createUser(@Body() createUserDto: CreateUserRequestDto) {
    return this.commandBus.execute(new CreateUserCommand(createUserDto));
  }

  @Get()
  @ApiOperation({ summary: 'Get All Users' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @RequirePermission('User', 'read')
  findAllUsers() {
    return this.queryBus.execute(new GetAllUsersQueryCommand());
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get User By Id' })
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: User,
  })
  @RequirePermission('User', 'read')
  findOneUser(@Param('id') id: string) {
    return this.queryBus.execute(new GetUserByIdQueryCommand(id));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update User By Id' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.commandBus.execute(new UpdateUserCommand(id, updateUserDto));
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete User By Id' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  removeUser(@Param('id') id: string) {
    return this.commandBus.execute(new RemoveUserCommand(id));
  }

  @Post('presigned-url')
  @ApiOperation({ summary: 'Get Presign-Url AWS' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async getPresignedUrl(@Body() request: GeneratePresignedUrlRequestDto) {
    return this.commandBus.execute(new GeneratePresignedUrlCommand(request));
  }

  @Get('download/cv/:id')
  @ApiOperation({ summary: 'Download CV' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async downloadFile(@Param('id') id: string) {
    return this.queryBus.execute(new GetCvDownloadUrlQuery(id));
  }

  @Get(':id/permissions')
  @ApiOperation({ summary: 'Get User Permissions' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async getUserPermissions(@Param('id') userId: string) {
    return this.queryBus.execute(new GetUserPermissionsQuery(userId));
  }

  @Get(':id/can-do')
  @ApiOperation({ summary: 'Get User Permision By Domain' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async checkUserPermission(
    @Param('id') userId: string,
    @Query('domain') domain: string,
    @Query('action') action: 'create' | 'read' | 'edit' | 'delete',
  ) {
    return this.queryBus.execute(
      new CheckUserPermissionQuery(userId, domain, action),
    );
  }
}
