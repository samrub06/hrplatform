import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class LoginRequestDto {
  @ApiProperty({ description: 'The email of the user' })
  @IsEmail({}, { message: 'The email must be valid' })
  @IsNotEmpty({ message: 'The email is required' })
  email: string;

  @ApiProperty({ description: 'The password of the user' })
  @IsNotEmpty({ message: 'The password is required' })
  @MinLength(6, {
    message: 'The password must contain at least 6 characters',
  })
  password: string;
}
