import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RegisterAdminRequestDto {
  @ApiProperty({ description: 'The name of the admin' })
  @IsNotEmpty({ message: 'The name cannot be empty' })
  @IsString({ message: 'The name must be a string' })
  name: string;

  @ApiProperty({ description: 'The email of the admin' })
  @IsEmail({}, { message: 'The email must be valid' })
  @IsNotEmpty({ message: 'The email cannot be empty' })
  email: string;

  @ApiProperty({ description: 'The password of the admin' })
  @IsNotEmpty({ message: 'The password cannot be empty' })
  password: string;

  @ApiProperty({ description: 'The secret code for admin registration' })
  @IsNotEmpty({ message: 'The secret code is required' })
  @IsString({ message: 'The secret code must be a string' })
  secretCode: string;
}
