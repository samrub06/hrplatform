import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
// req.user.email, req.user.first_name, req.user.last_name, req.user.picture, req.user.googleId

export class RegisterGoogleRequestDto {
  @ApiProperty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsString()
  picture: string;

  @ApiProperty()
  @IsString()
  googleId: string;
}
