import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { RolePermission } from './role-permission.model';

@Table({ tableName: 'Permission' })
export class Permission extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Column
  name: string;

  @HasMany(() => RolePermission)
  rolePermissions: RolePermission[];
}
