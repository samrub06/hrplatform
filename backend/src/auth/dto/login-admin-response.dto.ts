import { ApiProperty } from '@nestjs/swagger';

export class LoginAdminResponseDto {
  @ApiProperty({ description: 'The access token of the admin' })
  accessToken: string;
}