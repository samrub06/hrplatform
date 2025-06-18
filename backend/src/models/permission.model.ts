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
  resource: string;

  @Column({ type: DataType.STRING})
  action: string;

 
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
