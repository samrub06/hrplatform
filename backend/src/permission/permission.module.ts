import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { RolePermission } from 'src/models/role-permission.model';
import { Role } from 'src/models/role.model';
import { User } from 'src/users/models/user.model';
import { Permission } from '../models/permission.model';
import { PermissionController } from './permission.controller';
import { PermissionService } from './permission.service';

@Module({
  imports: [
    SequelizeModule.forFeature([User, Role, Permission, RolePermission]),
  ],
  providers: [PermissionService],
  controllers: [PermissionController],
  exports: [PermissionService],
})
export class PermissionModule {}
