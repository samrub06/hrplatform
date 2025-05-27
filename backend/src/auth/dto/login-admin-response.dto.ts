import { ApiProperty } from '@nestjs/swagger';

export class LoginAdminResponseDto {
  @ApiProperty({ description: 'The access token of the admin' })
  accessToken: string;

  @ApiProperty({ description: 'The refresh token of the admin' })
  refreshToken: string;
}
