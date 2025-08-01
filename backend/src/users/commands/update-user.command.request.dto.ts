import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class UpdateUserRequestDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  first_name?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  last_name?: string;

  @ApiProperty()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  profilePicture?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  cv?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  salary_expectation?: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  years_of_experience?: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  desired_position?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  phone_number?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  github_link?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  linkedin_link?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public_link_code?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  admin_note_id?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  role?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  role_id?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  current_position?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  current_company?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  birthday?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  googleId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  linkedinId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  onboarding_step?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  onboarding_completed?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  onboarding_completed_at?: Date;
}
