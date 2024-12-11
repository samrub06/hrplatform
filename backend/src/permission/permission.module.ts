import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from 'src/auth/auth.module';
import { RolePermission } from 'src/models/role-permission.model';
import { Role } from 'src/models/role.model';
import { User } from 'src/users/models/user.model';
import { Permission } from '../models/permission.model';
import { PermissionController } from './permission.controller';
import { PermissionRepository } from './permission.repository';
import { PermissionService } from './permission.service';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    SequelizeModule.forFeature([User, Role, Permission, RolePermission]),
  ],
  providers: [PermissionService, PermissionRepository],
  controllers: [PermissionController],
  exports: [PermissionService],
})
export class PermissionModule {}
