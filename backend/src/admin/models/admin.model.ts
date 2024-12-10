import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'admin' })
export class Admin extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Column
  name: string;

  @Column
  password: string;
}
