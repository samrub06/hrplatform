import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guards';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { PermissionGuard } from './permission.guard';
import { PermissionRepository } from './permission.repository';
import { RequirePermission } from './require-permission.decorator';

@ApiTags('Permission')
@ApiBearerAuth()
@Controller('permissions')
@UseGuards(AuthGuard, PermissionGuard)
export class PermissionController {
  constructor(private readonly permissionRepository: PermissionRepository) {}

  @Post()
  @ApiOperation({ summary: 'Create Permission' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @RequirePermission('Permission', 'create')
  create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionRepository.create(createPermissionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get All Permissions' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @RequirePermission('Permission', 'read')
  findAll() {
    return this.permissionRepository.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Permission By Id' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @RequirePermission('Permission', 'read')
  findOne(@Param('id') id: string) {
    return this.permissionRepository.findOne(id);
  }
}
