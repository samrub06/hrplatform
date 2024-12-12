import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AdminModule } from 'src/admin/admin.module';
import { AuthModule } from 'src/auth/auth.module';
import { CaslModule } from 'src/casl/casl.module';
import { RolePermission } from 'src/models/role-permission.model';
import { Role } from 'src/models/role.model';
import { User } from 'src/users/models/user.model';
import { UserRepository } from 'src/users/user.repository';
import { Permission } from '../models/permission.model';
import { PermissionController } from './permission.controller';
import { PermissionRepository } from './permission.repository';
import { PermissionService } from './permission.service';

@Module({
  imports: [
    SequelizeModule.forFeature([User, Role, Permission, RolePermission]),
    forwardRef(() => AuthModule),
    forwardRef(() => AdminModule),
    forwardRef(() => CaslModule),
  ],
  providers: [PermissionService, PermissionRepository, UserRepository],
  controllers: [PermissionController],
  exports: [PermissionService],
})
export class PermissionModule {}
