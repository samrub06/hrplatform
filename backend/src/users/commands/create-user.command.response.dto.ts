import { ApiProperty } from '@nestjs/swagger';

export class CreateUserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  first_name: string;

  @ApiProperty()
  last_name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  profilePicture?: string;

  @ApiProperty()
  cv?: string;

  @ApiProperty()
  skills: {
    language: string;
    experience_years: number;
    level?: number;
  }[];

  @ApiProperty()
  desired_position?: string;

  @ApiProperty()
  roleId: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
