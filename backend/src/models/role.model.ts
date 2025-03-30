import {
  BelongsToMany,
  Column,
  DataType,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Permission } from './permission.model';
import { RolePermission } from './role-permission.model';
import { User } from './user.model';

@Table({ tableName: 'role' })
export class Role extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @HasMany(() => User)
  users: User[];

  @HasMany(() => RolePermission, {
    foreignKey: 'role_id',
    as: 'rolePermissions',
    onDelete: 'CASCADE',
  })
  rolePermissions: RolePermission[];

  @BelongsToMany(() => Permission, {
    through: () => RolePermission,
    foreignKey: 'role_id',
    otherKey: 'permission_id',
  })
  permissions: Permission[];
}
