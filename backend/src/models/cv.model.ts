import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { CVEducation } from './cv-education.model';
import { CVExperience } from './cv-experience.model';
import { CVSkill } from './cv-skill.model';
import { User } from './user.model';

@Table({ tableName: 'cv' })
export class CV extends Model {
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
  fileName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  email?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  s3_url?: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  file_size?: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  mime_type?: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  ocr_processed: boolean;

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  ocr_raw_data?: object;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'user_id',
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
    allowNull: true,
  })
  phone: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  location: string;

  @HasMany(() => CVSkill, {
    foreignKey: 'cv_id',
    as: 'skills',
  })
  skills: CVSkill[];

  @HasMany(() => CVEducation, {
    foreignKey: 'cv_id',
    as: 'education',
  })
  education: CVEducation[];

  @HasMany(() => CVExperience, {
    foreignKey: 'cv_id',
    as: 'experiences',
  })
  experiences: CVExperience[];

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
