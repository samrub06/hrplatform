import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from './user.model';

@Table({ tableName: 'emails' })
export class Email extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    allowNull: false,
  })
  id: string;
  @ForeignKey(() => User)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  user_id: string;

  @BelongsTo(() => User)
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
    type: DataType.STRING,
    allowNull: true,
  })
  body: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  body_html: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  status: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  has_attachment: boolean;

  @Column({
    type: DataType.ENUM,
    values: ['new email', 'registration', 'forgot password'],
    allowNull: false,
  })
  template_name: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
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
