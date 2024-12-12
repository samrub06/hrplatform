import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserRequestDto {
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
  password_confirmation?: string;

  @ApiProperty({ description: "Le mot de passe de l'utilisateur" })
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @ApiProperty({ description: "Le mot de passe de l'utilisateur" })
  @IsString()
  @IsNotEmpty()
  last_name?: string;

  @ApiProperty({ description: 'role is required' })
  @IsString()
  @IsNotEmpty()
  role_id?: string;
}
