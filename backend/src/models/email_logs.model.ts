import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from './user.model';

@Table({
  tableName: 'email_logs',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
})
export class EmailLogs extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

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
    onDelete: 'CASCADE',
  })
  user: User;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  sender_email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  sender_name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  recipient_email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  type: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  subject: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  body: string;

  @Column({
    type: DataType.ENUM('pending', 'sent', 'failed'),
    allowNull: false,
    defaultValue: 'pending',
  })
  status: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  has_attachment: boolean;

  @Column({
    type: DataType.ENUM('new email', 'registration', 'forgot password'),
    allowNull: false,
  })
  template_name: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  is_read: boolean;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  sent_at: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  received_at: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  createdAt: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  updatedAt: Date;
}
