import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Permission } from '../models/permission.model';
import { RolePermission } from '../models/role-permission.model';
import { Role } from '../models/role.model';
import { User } from '../users/models/user.model';

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
    domain: string,
    action: 'create' | 'read' | 'edit' | 'delete',
  ): Promise<boolean> {
    const permissions = await this.getUserPermissions(userId);

    return permissions.some(
      (permission) =>
        permission.domain === domain && permission[`can_${action}`] === true,
    );
  }
}
