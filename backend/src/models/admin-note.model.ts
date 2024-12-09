import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from 'src/users/models/user.model';

@Table({ tableName: 'AdminNote' })
export class AdminNote extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @Column(DataType.TEXT)
  note: string;

  @Column
  createdAt: Date;

  @Column
  updatedAt: Date;
}
