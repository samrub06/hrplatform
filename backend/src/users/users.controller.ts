import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
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
import { AwsService, FileKey } from '../aws/aws.service';
import { AppAbility } from '../casl/casl-ability.factory';
import { CheckPolicies } from '../casl/check-policies.decorator';
import { PoliciesGuard } from '../casl/policies.guard';
import { Public } from '../casl/public.decorator';
import { User } from '../models/user.model';
import { CreateUserCommand } from './commands/create-user.command';
import { CreateUserRequestDto } from './commands/create-user.command.request.dto';
import { GeneratePresignedUrlCommand } from './commands/generate-presigned-url.command';
import { GeneratePresignedUrlRequestDto } from './commands/generate-presigned-url.command.request.dto';
import { GeneratePublicLinkCommand } from './commands/generate-public-link.command';
import { GetCvDownloadUrlQuery } from './commands/get-cv-download-url-query';
import { RemoveUserCommand } from './commands/remove-user.command';
import { UpdateUserRoleCommand } from './commands/update-user-role.command';
import { UpdateUserCommand } from './commands/update-user.command';
import { UpdateUserRequestDto } from './commands/update-user.command.request.dto';
import { CheckUserPermissionQuery } from './queries/check-user-permission.query';
import { GetAllAlumniQuery } from './queries/get-all-alumni.query';
import { GetAllUsersQueryCommand } from './queries/get-all-user.query';
import { GetPublicProfileQuery } from './queries/get-public-profile.query';
import { GetUserByIdQueryCommand } from './queries/get-user-by-id.query';
import { GetUserPermissionsQuery } from './queries/get-user-permissions.query';

@ApiTags('User')
@ApiBearerAuth()
@Controller('user')
export class UsersController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly awsService: AwsService,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Create User' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, User))
  /* @RateLimit({
    ttl: 60, // 1 minute window
    limit: 10, // 10 requests per minute
    keyPrefix: 'api', // Optional prefix for Redis key
  }) */
  createUser(@Body() createUserDto: CreateUserRequestDto) {
    return this.commandBus.execute(new CreateUserCommand(createUserDto));
  }

  @Get()
  @UseGuards(AuthGuard, PoliciesGuard)
  @ApiOperation({ summary: 'Get All Users' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  //@CheckPolicies((ability: AppAbility) => ability.can(Action.Read, User))
  findAllUsers() {
    return this.queryBus.execute(new GetAllUsersQueryCommand());
  }

  @Post('all-publishers')
  @UseGuards(AuthGuard, PoliciesGuard)
  @ApiOperation({ summary: 'Get All Alumni' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, User))
  findAllAlumni() {
    return this.queryBus.execute(new GetAllAlumniQuery());
  }

  @Get(':id')
  @UseGuards(AuthGuard, PoliciesGuard)
  @ApiOperation({ summary: 'Get User By Id' })
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: User,
  })
  //@CheckPolicies((ability: AppAbility) => ability.can(Action.Update, User))
  findOneUser(@Param('id') id: string) {
    return this.queryBus.execute(new GetUserByIdQueryCommand(id));
  }

  @Patch(':id')
  @UseGuards(AuthGuard, PoliciesGuard)
  @ApiOperation({ summary: 'Update User By Id' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, User))
  updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserRequestDto,
  ) {
    return this.commandBus.execute(new UpdateUserCommand(id, updateUserDto));
  }

  @Patch('role/:id')
  @UseGuards(AuthGuard, PoliciesGuard)
  @ApiOperation({ summary: 'Update User Role By Id' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  //@CheckPolicies((ability: AppAbility) => ability.can(Action.Update, User))
  updateUserRole(@Param('id') id: string, @Body() role: string) {
    return this.commandBus.execute(new UpdateUserRoleCommand(id, role));
  }

  @Delete(':id')
  @UseGuards(AuthGuard, PoliciesGuard)
  @ApiOperation({ summary: 'Delete User By Id' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, User))
  removeUser(@Param('id') id: string) {
    return this.commandBus.execute(new RemoveUserCommand(id));
  }

  @Post('presigned-url')
  @UseGuards(AuthGuard, PoliciesGuard)
  @ApiOperation({ summary: 'Get Presign-Url AWS' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, User))
  async getPresignedUrl(@Body() request: GeneratePresignedUrlRequestDto) {
    return this.commandBus.execute(new GeneratePresignedUrlCommand(request));
  }

  @Get('download/cv/:id')
  @UseGuards(AuthGuard, PoliciesGuard)
  @ApiOperation({ summary: 'Download CV' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, User))
  async downloadFile(@Param('id') id: string) {
    return this.queryBus.execute(new GetCvDownloadUrlQuery(id));
  }

  @Get('me/permissions')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get User Permissions' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async getUserPermissions(@Request() req) {
    const userId = req.user.id; // L'ID de l'utilisateur est extrait du token par AuthGuard
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

  @Post(':id/public-link')
  async generatePublicLink(@Param('id') userId: string) {
    return this.commandBus.execute(new GeneratePublicLinkCommand(userId));
  }

  @Public()
  @Get('profile/public/:token')
  async getPublicProfile(@Param('token') token: string) {
    return this.queryBus.execute(new GetPublicProfileQuery(token));
  }

  @Get('file/:userId/:fileKey/:fileName')
  @UseGuards(AuthGuard, PoliciesGuard)
  @ApiOperation({ summary: 'Get File URL' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, User))
  async getFileUrl(
    @Param('userId') userId: string,
    @Param('fileKey') fileKey: FileKey,
    @Param('fileName') fileName: string,
  ) {
    const url = await this.awsService.generateDownloadUrl(
      fileName,
      userId,
      fileKey,
    );
    return { url };
  }
}
