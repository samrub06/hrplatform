import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginAdminRequestDto {
  @ApiProperty({ description: "L'email de l'administrateur" })
  @IsEmail({}, { message: "L'email doit être valide" })
  @IsNotEmpty({ message: "L'email est requis" })
  email: string;

  @ApiProperty({ description: "Le mot de passe de l'administrateur" })
  @IsNotEmpty({ message: 'Le mot de passe est requis' })
  password: string;
}
