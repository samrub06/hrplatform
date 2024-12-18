import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from 'src/users/models/user.model';

export enum WorkCondition {
  ONSITE = 'onsite',
  REMOTE = 'remote',
  HYBRID = 'hybrid',
}

export enum CompanyType {
  STARTUP = 'startup',
  ENTERPRISE = 'enterprise',
  SMB = 'smb',
  CONSULTING = 'consulting',
}

export enum SkillLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert',
}

@Table({ tableName: 'job' })
export class Job extends Model {
  @Column({
    type: DataType.UUID,
    autoIncrement: true,
    primaryKey: true,
  })
  id: string;

  @Column
  name: string;

  @Column(DataType.TEXT)
  description: string;

  @Column(DataType.DECIMAL)
  salary_offered: number;

  @Column({
    type: DataType.JSONB,
    defaultValue: [],
  })
  skills: {
    name: string;
    years_required: number;
    level: string;
  }[];

  @Column
  global_year_experience: number;

  @Column
  city: string;

  @Column({
    type: DataType.ENUM,
    values: Object.values(WorkCondition),
  })
  work_condition: WorkCondition;

  @Column
  company_name: string;

  @Column({
    type: DataType.ENUM,
    values: Object.values(CompanyType),
  })
  company_type: CompanyType;

  @Column
  contact_name: string;

  @Column
  phone_number: string;

  @Column
  email_address: string;

  @Column
  updatedAt: Date;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  userId: string;

  @BelongsTo(() => User)
  user: User;
}
