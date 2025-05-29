import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AwsService } from './../../aws/aws.service';
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
    const { fileName, folderUserId, fileKey } = command.request;

    // fileKey is CV pdf type // if fileKey is profilepicture, then fileKey is image/jpeg

    const presignedUrl = await this.awsService.generatePresignedUrl(
      fileName,
      folderUserId,
      fileKey,
      'application/octet-stream',
    );
    return { presignedUrl };
  }
}
