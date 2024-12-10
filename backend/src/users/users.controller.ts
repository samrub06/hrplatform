import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { AuthGuard } from 'src/auth/auth.guards';
import { AwsService } from 'src/aws/aws.service';

import { PermissionGuard } from 'src/permission/permission.guard';
import { PermissionService } from 'src/permission/permission.service';
import { RequirePermission } from 'src/permission/require-permission.decorator';
import { CreateUserCommand } from './commands/create-user.command';
import { CreateUserRequestDto } from './commands/create-user.command.request.dto';
import { RemoveUserCommand } from './commands/remove-user.command';
import { UpdateUserCommand } from './commands/update-user.command';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetAllUsersQueryCommand } from './queries/getAllUser.query';
import { GetUserByIdQueryCommand } from './queries/getUserById.query';

@Controller('user')
@UseGuards(AuthGuard, PermissionGuard)
export class UsersController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly awsService: AwsService,
    private readonly permissionService: PermissionService,
  ) {}

  @Post()
  createUser(@Body() createUserDto: CreateUserRequestDto) {
    return this.commandBus.execute(new CreateUserCommand(createUserDto));
  }

  @Get()
  @RequirePermission('User', 'read')
  findAllUsers() {
    return this.queryBus.execute(new GetAllUsersQueryCommand());
  }

  @Get(':id')
  @RequirePermission('User', 'read')
  findOneUser(@Param('id') id: string) {
    return this.queryBus.execute(new GetUserByIdQueryCommand(id));
  }

  @Patch(':id')
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.commandBus.execute(new UpdateUserCommand(id, updateUserDto));
  }

  @Delete(':id')
  removeUser(@Param('id') id: string) {
    return this.commandBus.execute(new RemoveUserCommand(id));
  }

  @Post('presigned-url')
  async getPresignedUrl(
    @Body() body: { fileName: string; fileType: string; folderUserId: string },
  ) {
    const presignedUrl = await this.awsService.generatePresignedUrl(
      body.fileName,
      body.folderUserId,
      body.fileType,
    );
    return { presignedUrl };
  }

  @Get('download/cv/:id')
  async downloadFile(@Param('id') id: string) {
    const user = await this.queryBus.execute(new GetUserByIdQueryCommand(id));
    if (!user || !user.cv) {
      throw new NotFoundException('File not found');
    }

    const fileName = user.cv; // Assurez-vous que le nom du fichier est stocké dans l'utilisateur
    const folderUserId = user.id.toString(); // ID de l'utilisateur

    const presignedUrl = await this.awsService.generateDownloadPresignedUrl(
      fileName,
      folderUserId,
    );
    return { presignedUrl };
  }

  @Get(':id/permissions')
  async getUserPermissions(@Param('id') userId: string) {
    return this.permissionService.getUserPermissions(userId);
  }

  @Get(':id/can-do')
  async checkUserPermission(
    @Param('id') userId: string,
    @Query('domain') domain: string,
    @Query('action') action: 'create' | 'read' | 'edit' | 'delete',
  ) {
    return this.permissionService.canUserDo(userId, domain, action);
  }
}
