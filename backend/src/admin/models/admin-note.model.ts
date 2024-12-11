import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from 'src/users/models/user.model';

@Table({ tableName: 'admin_notes' })
export class AdminNote extends Model {
  @Column
  content: string;

  @Column
  createdBy: number; // ID de l'admin qui a créé la note

  @ForeignKey(() => User)
  @Column
  userId: number;

  @BelongsTo(() => User)
  user: User;
}
