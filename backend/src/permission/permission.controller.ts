import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { PermissionRepository } from './permission.repository';

@ApiTags('Permission')
@ApiBearerAuth()
@Controller('permissions')
export class PermissionController {
  constructor(private readonly permissionRepository: PermissionRepository) {}

  @Post()
  @ApiOperation({ summary: 'Create Permission' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionRepository.create(createPermissionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get All Permissions' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  findAll() {
    return this.permissionRepository.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Permission By Id' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  findOne(@Param('id') id: string) {
    return this.permissionRepository.findOne(id);
  }
}
