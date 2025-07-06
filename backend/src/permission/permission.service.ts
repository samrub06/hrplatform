import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Permission } from '../models/permission.model';
import { RolePermission } from '../models/role-permission.model';
import { Role } from '../models/role.model';
import { User } from '../models/user.model';

@Injectable()
export class PermissionService {
  constructor(@InjectModel(User) private userModel: typeof User) {}

  async getUserPermissions(userId: string): Promise<Permission[]> {
    const user = await this.userModel.findOne({
      where: { id: userId },
      include: [
        {
          model: Role,
          include: [
            {
              model: RolePermission,
              as: 'rolePermissions',
              include: [Permission],
            },
          ],
        },
      ],
    });

    if (!user?.role?.rolePermissions) {
      return [];
    }

    return user.role.rolePermissions.map((rp) => rp.permission);
  }

  async canUserDo(
    userId: string,
    action: 'create' | 'read' | 'edit' | 'delete',
    resource: string,
  ): Promise<boolean> {
    const permissions = await this.getUserPermissions(userId);

    return permissions.some(
      (permission) =>
        permission.resource === resource && permission[`can_${action}`] === true,
    );
  }
}
