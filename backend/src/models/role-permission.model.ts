import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Permission } from './permission.model';
import { Role } from './role.model';

@Table({ tableName: 'role_permission' })
export class RolePermission extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => Role)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'role_id',
  })
  role_id: string;

  @BelongsTo(() => Role, {
    foreignKey: 'role_id',
    as: 'role',
  })
  role: Role;

  @ForeignKey(() => Permission)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'permission_id',
  })
  permission_id: string;

  @BelongsTo(() => Permission, {
    foreignKey: 'permission_id',
    as: 'permission',
  })
  permission: Permission;
}
