import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from '../../users/models/user.model';
import { Admin } from './admin.model';

@Table({ tableName: 'admin_notes' })
export class AdminNote extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Column
  note: string;

  @ForeignKey(() => Admin)
  @Column
  admin_id: string;

  @BelongsTo(() => Admin)
  admin: Admin;

  @ForeignKey(() => User)
  @Column
  user_id: string;

  @BelongsTo(() => User)
  user: User;

  @Column
  createdAt: Date;

  @Column
  updatedAt: Date;
}
