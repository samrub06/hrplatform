import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';

class SkillDto {
  @IsString()
  language: string;

  @IsOptional()
  experience_years: number;

  @IsOptional()
  level?: number;
}

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
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SkillDto)
  skills?: SkillDto[];

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
  role_id?: string;
}
