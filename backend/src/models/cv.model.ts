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
