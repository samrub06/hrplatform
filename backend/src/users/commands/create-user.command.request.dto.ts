import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserRequestDto {
  @ApiProperty({ description: "Le prénom de l'utilisateur" })
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @ApiProperty({ description: "Le nom de famille de l'utilisateur" })
  @IsString()
  @IsNotEmpty()
  last_name: string;

  @ApiProperty({ description: "L'adresse email de l'utilisateur" })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: "Le mot de passe de l'utilisateur" })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({ description: "Le mot de passe de l'utilisateur" })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password_confirmation: string;

  @ApiProperty({ description: "Photo de profil de l'utilisateur" })
  @IsOptional()
  @IsString()
  profilePicture?: string;

  @ApiProperty({ description: "CV de l'utilisateur" })
  @IsOptional()
  @IsString()
  cv?: string;

  @ApiProperty({ description: "Compétences de l'utilisateur" })
  @IsOptional()
  @IsString({ each: true })
  skills: {
    language: string;
    experience_years: number;
    level?: number;
  }[];
  @ApiProperty({ description: "Poste recherché par l'utilisateur" })
  @IsOptional()
  @IsString()
  desired_position?: string;

  @ApiProperty({ description: "ID du rôle de l'utilisateur" })
  @IsNotEmpty()
  roleId: number;
}
