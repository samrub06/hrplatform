import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl } from 'class-validator';
import { Role } from 'src/app.enum';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  password_confirmation?: string;
  public_link_code?: string;
  role: Role;
  skills: string[];
  cv: string;
  years_experience?: number;
  updateAt: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  phone_number?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUrl({}, { message: 'Le lien GitHub doit être une URL valide' })
  github_link?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUrl({}, { message: 'Le lien LinkedIn doit être une URL valide' })
  linkedin_link?: string;
}
