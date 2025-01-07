import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateUserRoleRequestDto {
  @ApiProperty({ enum: ['candidate', 'publisher'] })
  @IsNotEmpty({ message: 'Le rôle est requis' })
  @IsEnum(['candidate', 'publisher'], {
    message: 'Le rôle doit être soit candidate soit publisher',
  })
  role: string;
}
