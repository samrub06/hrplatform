import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SendEmailResponseDto {
  @ApiProperty({
    description: 'The status of the email',
    example: 'Email sent successfully',
  })
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiProperty({
    description: 'The recipient email address',
    example: 'recipient@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  to: string;

  @ApiProperty({
    description: 'The subject of the email',
    example: 'Welcome to our platform',
  })
  @IsString()
  @IsNotEmpty()
  subject: string;
}
