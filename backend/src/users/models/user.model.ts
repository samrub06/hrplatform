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
import { AdminNote } from '../../admin/models/admin-note.model';
import { CV } from '../../cv/models/cv.model';
import { Role } from '../../models/role.model';

interface SkillDto {
  language: string;
  experience_years: number;
  level?: number;
}

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
    type: DataType.JSON, // Changé de STRING à JSON
    allowNull: true,
    get() {
      const rawValue = this.getDataValue('skills');
      return rawValue ? JSON.parse(rawValue) : [];
    },
    set(value: any) {
      this.setDataValue('skills', JSON.stringify(value));
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
  salary_expectation?: string;

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
}
