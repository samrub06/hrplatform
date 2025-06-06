import { ApiProperty } from '@nestjs/swagger';
import { WorkCondition } from '../../models/job.model';

export class CreateJobResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  link_referral: string;

  @ApiProperty()
  skills: {
    name: string;
    years_required: number;
  }[];

  @ApiProperty()
  global_year_experience: number;

  @ApiProperty()
  city: string;

  @ApiProperty()
  work_condition: WorkCondition;

  @ApiProperty()
  company_name: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  contact_name: string;

  @ApiProperty()
  phone_number: string;

  @ApiProperty()
  email_address: string;

  @ApiProperty()
  createdAt?: Date;

  @ApiProperty()
  updatedAt: Date;
}
