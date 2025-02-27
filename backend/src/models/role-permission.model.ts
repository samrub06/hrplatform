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
  })
  role_id: string;

  @ForeignKey(() => Permission)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  permission_id: string;

  @BelongsTo(() => Role)
  role: Role;

  @BelongsTo(() => Permission)
  permission: Permission;
}
