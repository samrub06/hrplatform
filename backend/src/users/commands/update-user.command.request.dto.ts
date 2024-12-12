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
  @IsString({ each: true })
  skills?: string[];

  @ApiProperty()
  @IsOptional()
  @IsString()
  desired_position?: string;

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
  @IsNumber()
  roleId?: number;
}
