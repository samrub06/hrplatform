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
  })
  id: string;

  @ForeignKey(() => CV)
  @Column
  cvId: string;

  @BelongsTo(() => CV)
  cv: CV;

  @Column
  name: string;

  @Column(DataType.INTEGER)
  level: number;

  @Column(DataType.INTEGER)
  yearsOfExperience: number;
}
