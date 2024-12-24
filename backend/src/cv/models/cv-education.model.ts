import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { CV } from './cv.model';

@Table({ tableName: 'cv_education' })
export class CVEducation extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => CV)
  @Column
  cvId: string;

  @BelongsTo(() => CV)
  cv: CV;

  @Column
  institution: string;

  @Column
  degree: string;

  @Column
  fieldOfStudy: string;

  @Column(DataType.DATE)
  startDate: Date;

  @Column(DataType.DATE)
  endDate: Date;

  @Column(DataType.TEXT)
  description: string;
}
