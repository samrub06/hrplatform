import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { FileKey } from 'src/aws/aws.service';

export class GeneratePresignedUrlRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  fileName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  fileKey: FileKey;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  folderUserId: string;
}
