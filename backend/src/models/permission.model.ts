import {
  BelongsToMany,
  Column,
  DataType,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { RolePermission } from './role-permission.model';
import { Role } from './role.model';

@Table({ tableName: 'permission' })
export class Permission extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Column
  name: string;

  @Column
  domain: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  can_read: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  can_create: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  can_edit: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  can_delete: boolean;

  @Column
  createdAt?: Date;

  @Column
  updatedAt?: Date;

  @HasMany(() => RolePermission, {
    foreignKey: 'permission_id',
    as: 'rolePermissions',
  })
  rolePermissions: RolePermission[];

  @BelongsToMany(() => Role, {
    through: () => RolePermission,
    foreignKey: 'permission_id',
    otherKey: 'role_id',
  })
  roles: Role[];
}
