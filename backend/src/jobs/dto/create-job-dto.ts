import { ApiProperty } from '@nestjs/swagger';
import {
	IsEmail,
	IsEnum,
	IsNotEmpty,
	IsNumber,
	IsString,
} from 'class-validator';
import { CompanyType, WorkCondition } from '../models/job.model';

export class CreateJobDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  salary_offered: number;

  @ApiProperty()
  @IsNotEmpty()
  skills: {
    name: string;
    years_required: number;
  }[];

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  global_year_experience: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  city: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(WorkCondition)
  work_condition: WorkCondition;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  company_name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(CompanyType)
  company_type: CompanyType;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  contact_name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  phone_number: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email_address: string;
}
