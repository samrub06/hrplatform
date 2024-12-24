import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserRequestDto {
  @ApiProperty({ description: 'email' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'password' })
  @IsString()
  @MinLength(6)
  password?: string;

  @ApiProperty({ description: 'password confirmation' })
  @IsString()
  @MinLength(6)
  password_confirmation?: string;

  @ApiProperty({ description: 'first name' })
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @ApiProperty({ description: 'last name' })
  @IsString()
  @IsNotEmpty()
  last_name?: string;

  @ApiProperty({ description: 'role is required' })
  @IsString()
  @IsNotEmpty()
  role_id?: string;
}
