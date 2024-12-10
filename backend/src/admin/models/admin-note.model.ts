import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Admin } from './admin.model';

@Table({ tableName: 'admin_note' })
export class AdminNote extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => Admin)
  @Column
  userId: number;

  @Column(DataType.TEXT)
  note: string;

  @Column
  createdAt: Date;

  @Column
  updatedAt: Date;
}
