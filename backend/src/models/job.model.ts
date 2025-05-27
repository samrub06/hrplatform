import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from './user.model';

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
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    allowNull: false,
  })
  id: string;

  @Column
  name: string;

  @Column(DataType.TEXT)
  description: string;

  @Column(DataType.STRING)
  link_referral: string;

  @Column({
    type: DataType.JSONB,
    defaultValue: [],
  })
  skills: {
    name: string;
    years_required: number;
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
