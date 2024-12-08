import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Role } from 'src/enums/role.enum';

export class CreateUserDto {
  @ApiProperty({ description: "Le prénom de l'utilisateur" })
  @IsString({ message: 'Le prénom doit être une chaîne.' })
  first_name?: string;

  @ApiProperty({ description: "Le nom de famille de l'utilisateur" })
  @IsString({ message: 'Le nom de famille doit être une chaîne.' })
  last_name?: string;

  @ApiProperty({ description: "L'adresse email de l'utilisateur" })
  @IsEmail({}, { message: "L'email doit être valide." })
  email: string;

  @ApiProperty({ description: "Le mot de passe de l'utilisateur" })
  @IsNotEmpty({ message: 'Le mot de passe ne peut pas être vide.' })
  @IsString({ message: 'Le mot de passe doit être une chaîne.' })
  @MinLength(6, {
    message: 'Le mot de passe doit contenir au moins 6 caractères.',
  })
  password: string;

  @ApiProperty({ description: "Confirmation du mot de passe de l'utilisateur" })
  @IsNotEmpty({
    message: 'La confirmation du mot de passe ne peut pas être vide.',
  })
  @IsString({
    message: 'La confirmation du mot de passe doit être une chaîne.',
  })
  @MinLength(6, {
    message:
      'La confirmation du mot de passe doit contenir au moins 6 caractères.',
  })
  password_confirmation?: string;

  @ApiProperty({ description: "Le rôle de l'utilisateur" })
  @IsNotEmpty({ message: 'Le rôle ne peut pas être vide.' })
  @IsString({ message: 'Le rôle doit être une chaîne.' })
  role: Role;

  @ApiProperty({
    description: "Date de création de l'utilisateur",
    type: String,
  })
  createdAt?: Date;

  @ApiProperty({ description: "Les compétences de l'utilisateur" })
  skills?: string[]; // Compétences optionnelles

  @ApiProperty({ description: "Le CV de l'utilisateur" })
  cv?: string;
}
