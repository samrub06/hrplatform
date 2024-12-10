import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GeneratePresignedUrlRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  fileName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  fileType: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  folderUserId: string;
}
