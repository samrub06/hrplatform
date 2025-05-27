import { MinLength } from 'class-validator';
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  HasOne,
  Model,
  Table,
} from 'sequelize-typescript';
import { AdminNote } from './admin-note.model';
import { CV } from './cv.model';
import { Email } from './emails.model';
import { Role } from './role.model';
import { SessionUser } from './sessionUser.model';
import { RefreshToken } from './token.model';

@Table({ tableName: 'user', timestamps: true })
export class User extends Model {
  @HasOne(() => RefreshToken, {
    foreignKey: 'userId',
    as: 'refreshToken',
  })
  refreshToken: RefreshToken;

  @HasOne(() => CV, {
    foreignKey: 'user_id',
    as: 'cv',
  })
  cv: CV;

  @HasMany(() => Email, {
    foreignKey: 'user_id',
    as: 'emails',
  })
  emails: Email[];

  @HasOne(() => AdminNote, {
    foreignKey: 'user_id',
    as: 'adminNotes',
    onDelete: 'CASCADE',
  })
  adminNotes: AdminNote;

  @HasMany(() => SessionUser, {
    foreignKey: 'userId',
    as: 'sessionUsers',
  })
  sessionUsers: SessionUser[];

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
    allowNull: true,
  })
  @MinLength(6, {
    message: 'Le mot de passe doit contenir au moins 6 caractères.',
  })
  password?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  profilePicture?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  desired_position?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  current_position?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  current_company?: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  years_experience?: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  salary_expectation?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  public_link_code?: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  isRevoked: boolean;

  @ForeignKey(() => Role)
  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'role_id',
    onDelete: 'SET NULL',
  })
  role_id: string;

  @BelongsTo(() => Role)
  role: Role;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  phone_number?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  github_link?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  linkedin_link?: string;

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

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  birthday?: Date;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  googleId?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  linkedinId?: string;
}
