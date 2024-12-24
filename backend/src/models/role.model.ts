import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { User } from '../users/models/user.model';
import { RolePermission } from './role-permission.model';

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
  })
  rolePermissions: RolePermission[];
}
