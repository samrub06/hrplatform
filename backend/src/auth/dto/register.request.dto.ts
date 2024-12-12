import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterRequestDto {
  @ApiProperty({ description: "L'email de l'utilisateur" })
  @IsEmail({}, { message: "L'email doit être valide" })
  @IsNotEmpty({ message: "L'email est requis" })
  email: string;

  @ApiProperty({ description: "Le mot de passe de l'utilisateur" })
  @IsNotEmpty({ message: 'Le mot de passe est requis' })
  @MinLength(6, {
    message: 'Le mot de passe doit contenir au moins 6 caractères',
  })
  password: string;

  @ApiProperty({ description: 'Confirmation du mot de passe' })
  @IsNotEmpty({ message: 'La confirmation du mot de passe est requise' })
  @MinLength(6)
  password_confirmation: string;

  @ApiProperty({ description: "Le prénom de l'utilisateur" })
  @IsString()
  @IsNotEmpty({ message: 'Le prénom est requis' })
  first_name: string;

  @ApiProperty({ description: "Le nom de l'utilisateur" })
  @IsString()
  @IsNotEmpty({ message: 'Le nom est requis' })
  last_name: string;

  @ApiProperty({ description: 'role' })
  @IsString()
  @IsNotEmpty({ message: 'role is required' })
  role: string;
}
