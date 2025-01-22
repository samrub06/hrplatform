//dto pour la commande update-cv-skills

import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, Min } from 'class-validator';
import { ProgrammingLanguage } from 'src/enums/programming-languages.enum';

export class UpdateCVSkillsRequestDto {
  @ApiProperty({
    enum: ProgrammingLanguage,
    description: 'The programming language',
    example: ProgrammingLanguage.JAVASCRIPT,
  })
  @IsEnum(ProgrammingLanguage, {
    message:
      'The skill name must be one of the following: JAVASCRIPT, TYPESCRIPT, PYTHON, etc.',
  })
  name: ProgrammingLanguage;

  @ApiProperty({
    description: 'The number of years of experience',
    minimum: 0,
    example: 3,
  })
  @IsNumber(
    {},
    {
      message: 'The years of experience must be a number',
    },
  )
  @Min(0, {
    message: 'The years of experience cannot be negative',
  })
  yearsOfExperience: number;
}
