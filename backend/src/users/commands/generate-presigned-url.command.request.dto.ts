import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { FileType } from 'src/aws/aws.service';

export class GeneratePresignedUrlRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  fileName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  folderUserId: string;

  @ApiProperty({ enum: FileType })
  @IsNotEmpty()
  fileType: FileType;
}
