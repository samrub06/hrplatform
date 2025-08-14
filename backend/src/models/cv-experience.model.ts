import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { CV } from './cv.model';

@Table({ tableName: 'cv_experiences' })
export class CVExperience extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
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
  title: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  company: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  startDate: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  endDate: Date;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isCurrent: boolean;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  location: string;

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