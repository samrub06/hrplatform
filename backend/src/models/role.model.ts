import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { User } from 'src/users/models/user.model';
import { RolePermission } from './role-permission.model';

@Table({ tableName: 'Role' })
export class Role extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Column
  name: string;

  @HasMany(() => User)
  users: User[];

  @HasMany(() => RolePermission)
  rolePermissions: RolePermission[];
}
