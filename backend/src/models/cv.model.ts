import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from 'src/models/user.model';
import { CVEducation } from './cv-education.model';
import { CVSkill } from './cv-skill.model';

@Table({ tableName: 'cv' })
export class CV extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Column
  fileName: string;

  @Column
  name: string;

  @Column
  email: string;

  @Column
  phone: string;

  @Column
  location: string;

  @ForeignKey(() => User)
  @Column
  userId: string;

  @BelongsTo(() => User)
  user: User;

  @HasMany(() => CVSkill)
  skills: CVSkill[];

  @HasMany(() => CVEducation)
  education: CVEducation[];
}
