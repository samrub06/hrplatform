import { Column, DataType, Model, Table } from 'sequelize-typescript';

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

@Table({ tableName: 'Job' })
export class Job extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column
  name: string;

  @Column(DataType.TEXT)
  description: string;

  @Column(DataType.DECIMAL)
  salary_offered: number;

  @Column(DataType.JSONB)
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
}