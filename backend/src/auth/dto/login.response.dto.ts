import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({ description: "Le token d'accès" })
  access_token: string;
}
