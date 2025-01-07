import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Admin } from './admin.model';
import { User } from './user.model';

@Table({
  tableName: 'admin_note',
  timestamps: true,
})
export class AdminNote extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    allowNull: false,
  })
  id: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  note: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'user_id',
    references: {
      model: 'user',
      key: 'id',
    },
  })
  user_id: string;

  @BelongsTo(() => User, {
    foreignKey: 'user_id',
    as: 'user',
  })
  user: User;

  @ForeignKey(() => Admin)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'admin_id',
    references: {
      model: 'admin',
      key: 'id',
    },
  })
  admin_id: string;

  @BelongsTo(() => Admin, {
    foreignKey: 'admin_id',
    as: 'admin',
  })
  admin: Admin;
}
