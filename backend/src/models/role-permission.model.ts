import {
  BelongsTo,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';
import { Permission } from './permission.model';
import { Role } from './role.model';

@Table({ tableName: 'RolePermission' })
export class RolePermission extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  roleId: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  permissionId: string;

  @BelongsTo(() => Role)
  role: Role;

  @BelongsTo(() => Permission)
  permission: Permission;
}
