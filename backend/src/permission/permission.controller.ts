import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Action } from '../app.enum';
import { AuthGuard } from '../auth/auth.guards';
import { AppAbility } from '../casl/casl-ability.factory';
import { CheckPolicies } from '../casl/check-policies.decorator';
import { PoliciesGuard } from '../casl/policies.guard';
import { Permission } from '../models/permission.model';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { PermissionRepository } from './permission.repository';

@ApiTags('Permission')
@ApiBearerAuth()
@Controller('permissions')
@UseGuards(AuthGuard, PoliciesGuard)
export class PermissionController {
  constructor(private readonly permissionRepository: PermissionRepository) {}

  @Post()
  @ApiOperation({ summary: 'Create Permission' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Update, Permission),
  )
  create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionRepository.create(createPermissionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get All Permissions' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Permission))
  findAll() {
    return this.permissionRepository.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Permission By Id' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Permission))
  findOne(@Param('id') id: string) {
    return this.permissionRepository.findOne(id);
  }
}
