import { IsNotEmpty, MinLength } from 'class-validator';
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { AdminNote } from 'src/admin/models/admin-note.model';
import { Role } from 'src/models/role.model';

@Table({ tableName: 'user' })
export class User extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    allowNull: false,
  })
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  first_name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  last_name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @IsNotEmpty({ message: 'Le mot de passe ne peut pas être vide.' })
  @MinLength(6, {
    message: 'Le mot de passe doit contenir au moins 6 caractères.',
  })
  password: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  profilePicture?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  cv?: string;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
    defaultValue: [],
  })
  skills: {
    language: string;
    experience_years: number;
    level?: number;
  }[];

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  desired_position: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  public_link_code?: string;

  @ForeignKey(() => AdminNote)
  @Column
  admin_note_id: string;

  @BelongsTo(() => AdminNote)
  adminNote: AdminNote;

  @ForeignKey(() => Role)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  roleId: string;

  @BelongsTo(() => Role)
  role: Role;

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
