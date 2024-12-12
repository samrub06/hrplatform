import { ApiProperty } from '@nestjs/swagger';

export class RegisterResponseDto {
  @ApiProperty({ description: "Le token d'accès" })
  access_token: string;
}
