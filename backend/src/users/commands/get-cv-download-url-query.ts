import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { AwsService, FileKey } from 'src/aws/aws.service';
import { UserRepository } from '../user.repository';

export class GetCvDownloadUrlQuery {
  constructor(public readonly userId: string) {}
}

@QueryHandler(GetCvDownloadUrlQuery)
export class GetCvDownloadUrlHandler
  implements IQueryHandler<GetCvDownloadUrlQuery>
{
  constructor(
    private readonly userRepository: UserRepository,
    private readonly awsService: AwsService,
  ) {}

  async execute(query: GetCvDownloadUrlQuery) {
    const user = await this.userRepository.findById(query.userId);
    if (!user || !user?.cv.id) {
      throw new NotFoundException('File not found');
    }

    const presignedUrl = await this.awsService.generateDownloadUrl(
      user.cv.fileName,
      user.id.toString(),
      FileKey.CV,
    );
    return { presignedUrl };
  }
}
