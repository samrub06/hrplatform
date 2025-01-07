import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { CV } from './cv.model';

@Table({ tableName: 'cv_skills' })
export class CVSkill extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    allowNull: false,
  })
  id: string;

  @ForeignKey(() => CV)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'cv_id',
    references: {
      model: 'cv',
      key: 'id',
    },
  })
  cv_id: string;

  @BelongsTo(() => CV, {
    foreignKey: 'cv_id',
    as: 'cv',
  })
  cv: CV;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  level: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  yearsOfExperience: number;

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
