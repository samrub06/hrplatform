import { MinLength } from 'class-validator';
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasOne,
  Model,
  Table,
} from 'sequelize-typescript';
import { CV } from 'src/models/cv.model';
import { AdminNote } from './admin-note.model';
import { Role } from './role.model';

interface SkillDto {
  language: string;
  experience_years: number;
  level?: number;
}

@Table({ tableName: 'user', timestamps: true })
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
    type: DataType.JSON,
    allowNull: true,
    get() {
      const rawValue = this.getDataValue('skills');
      if (!rawValue) return [];
      try {
        return typeof rawValue === 'string' ? JSON.parse(rawValue) : rawValue;
      } catch (error) {
        return [];
      }
    },
    set(value: any) {
      if (value === null || value === undefined) {
        this.setDataValue('skills', null);
      } else {
        this.setDataValue(
          'skills',
          typeof value === 'string' ? value : JSON.stringify(value),
        );
      }
    },
  })
  skills?: SkillDto[];

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  cv?: string;

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

  @HasOne(() => CV)
  cv_id: CV;

  @HasOne(() => AdminNote, {
    foreignKey: 'user_id',
    as: 'adminNotes',
  })
  adminNotes: AdminNote[];

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  birthday?: Date;
}
