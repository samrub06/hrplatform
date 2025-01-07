import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenRequestDto {
  @ApiProperty({ description: 'Le refresh token' })
  @IsNotEmpty({ message: 'Le refresh token est requis' })
  @IsString()
  refreshToken: string;
}
