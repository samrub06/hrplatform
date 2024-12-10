import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AwsService } from 'src/aws/aws.service';
import { GeneratePresignedUrlRequestDto } from './generate-presigned-url.command.request.dto';

export class GeneratePresignedUrlCommand {
  constructor(public readonly request: GeneratePresignedUrlRequestDto) {}
}

@CommandHandler(GeneratePresignedUrlCommand)
export class GeneratePresignedUrlHandler
  implements ICommandHandler<GeneratePresignedUrlCommand>
{
  constructor(private readonly awsService: AwsService) {}

  async execute(command: GeneratePresignedUrlCommand) {
    const { fileName, folderUserId, fileType } = command.request;
    const presignedUrl = await this.awsService.generatePresignedUrl(
      fileName,
      folderUserId,
      fileType,
    );
    return { presignedUrl };
  }
}
