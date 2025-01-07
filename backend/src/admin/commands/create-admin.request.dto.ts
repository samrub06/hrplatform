import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateAdminRequestDto {
  @ApiProperty({ description: "Nom de l'administrateur" })
  @IsNotEmpty({ message: 'Le nom ne peut pas être vide' })
  @IsString({ message: 'Le nom doit être une chaîne de caractères' })
  nom: string;

  @ApiProperty({ description: "Email de l'administrateur" })
  @IsEmail({}, { message: "L'email doit être valide" })
  @IsNotEmpty({ message: "L'email ne peut pas être vide" })
  email: string;

  @ApiProperty({ description: "Mot de passe de l'administrateur" })
  @IsNotEmpty({ message: 'Le mot de passe ne peut pas être vide' })
  @MinLength(6, {
    message: 'Le mot de passe doit contenir au moins 6 caractères',
  })
  motDePasse: string;
}
