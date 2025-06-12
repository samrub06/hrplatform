import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CaslModule } from '../casl/casl.module';
import { Permission } from '../models/permission.model';
import { RolePermission } from '../models/role-permission.model';
import { Role } from '../models/role.model';
import { User } from '../models/user.model';
import { UserRepository } from '../users/user.repository';
import { UsersModule } from '../users/users.module';
import { PermissionController } from './permission.controller';
import { PermissionRepository } from './permission.repository';
import { PermissionService } from './permission.service';

@Module({
  imports: [
    SequelizeModule.forFeature([User, Role, Permission, RolePermission]),
    forwardRef(() => CaslModule),
    forwardRef(() => UsersModule),
  ],
  providers: [PermissionService, PermissionRepository, UserRepository],
  controllers: [PermissionController],
  exports: [PermissionService],
})
export class PermissionModule {}
