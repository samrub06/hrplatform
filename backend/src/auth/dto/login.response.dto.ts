import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({ description: 'The access token' })
  accessToken: string;

  @ApiProperty({ description: 'The refresh token' })
  refreshToken: string;

  @ApiProperty({ description: 'The user id' })
  userId: string;

  @ApiProperty({ description: 'Whether user needs to complete role setup', required: false })
  needsRoleSetup?: boolean;
}
