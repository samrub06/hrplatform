import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from 'src/users/models/user.model';

@Table({ tableName: 'admin_note' })
export class AdminNote extends Model {
  @Column
  note: string;

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
