import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { AuthGuard } from 'src/auth/auth.guards';
import { RolesGuard } from 'src/auth/roles.guards';
import { AwsService } from 'src/aws/aws.service';
import { Roles } from 'src/decorator/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { CreateUserCommand } from './commands/create-user.command';
import { RemoveUserCommand } from './commands/remove-user.command';
import { UpdateUserCommand } from './commands/update-user.command';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindAllUsersQuery } from './queries/getAllUser.query';
import { FindUserByIdQuery } from './queries/getUserById.query';

@Controller('user')
@UseGuards(AuthGuard, RolesGuard)
export class UsersController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly awsService: AwsService,
  ) {}

  @Post()
  @Roles(Role.ADMIN)
  create(@Body() createUserDto: CreateUserDto) {
    return this.commandBus.execute(new CreateUserCommand(createUserDto));
  }

  @Get()
  @Roles(Role.ADMIN)
  findAll() {
    return this.queryBus.execute(new FindAllUsersQuery());
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.queryBus.execute(new FindUserByIdQuery(+id));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.commandBus.execute(new UpdateUserCommand(+id, updateUserDto));
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

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commandBus.execute(new RemoveUserCommand(+id));
  }

  @Get('download/cv/:id')
  async downloadFile(@Param('id') id: number) {
    const user = await this.queryBus.execute(new FindUserByIdQuery(id));
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
}
