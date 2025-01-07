import { Column, DataType, Model, Table } from 'sequelize-typescript';

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
}
