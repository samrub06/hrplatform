import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterRequestDto {
  @ApiProperty({ description: 'The email of the user' })
  @IsEmail({}, { message: 'The email must be valid' })
  @IsNotEmpty({ message: 'The email is required' })
  email: string;

  @ApiProperty({ description: 'The password of the user' })
  @IsNotEmpty({ message: 'The password is required' })
  @MinLength(6, {
    message: 'The password must contain at least 6 characters',
  })
  password?: string;

  @ApiProperty({ description: 'The password confirmation' })
  @IsNotEmpty({ message: 'The password confirmation is required' })
  @MinLength(6)
  password_confirmation?: string;

  @ApiProperty({ description: 'The first name of the user' })
  @IsString()
  @IsNotEmpty({ message: 'The first name is required' })
  first_name: string;

  @ApiProperty({ description: 'The last name of the user' })
  @IsString()
  @IsNotEmpty({ message: 'The last name is required' })
  last_name: string;

  @ApiProperty({ description: 'The picture of the user' })
  @IsString()
  @IsNotEmpty({ message: 'The picture is required' })
  picture: string;
}
