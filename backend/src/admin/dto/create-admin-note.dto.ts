import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAdminNoteDto {
  @ApiProperty({ description: "Note de l'administrateur" })
  @IsNotEmpty({ message: 'La note ne peut pas être vide' })
  @IsString({ message: 'La note doit être une chaîne de caractères' })
  note: string;
}
