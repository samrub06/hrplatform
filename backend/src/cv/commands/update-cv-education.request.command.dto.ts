import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateCVEducationRequestDto {
  @ApiProperty({ description: 'Name of the institution' })
  @IsNotEmpty({ message: 'The name of the institution is required' })
  @IsString()
  institution: string;

  @ApiProperty({ description: 'Degree obtained' })
  @IsNotEmpty({ message: 'The degree is required' })
  @IsString()
  degree: string;

  @ApiProperty({ description: 'Field of study' })
  @IsNotEmpty({ message: 'The field of study is required' })
  @IsString()
  fieldOfStudy: string;

  @ApiProperty({ description: 'Start date' })
  @IsNotEmpty({ message: 'The start date is required' })
  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @ApiProperty({ description: 'End date', required: false })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endDate?: Date;

  @ApiProperty({ description: 'Description of the formation', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
