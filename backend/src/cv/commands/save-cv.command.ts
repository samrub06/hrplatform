import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CVRepository } from '../cv.repository';

export class SaveCVCommand {
  constructor(
    public readonly userId: string,
    public readonly fileName: string,
  ) {}
}

@CommandHandler(SaveCVCommand)
export class SaveCVHandler implements ICommandHandler<SaveCVCommand> {
  constructor(private readonly cvRepository: CVRepository) {}

  async execute(command: SaveCVCommand) {
    const { userId, fileName } = command;

    // Create CV record in database with default values
    const cv = await this.cvRepository.create({
      fileName,
      name: 'CV', // Default name, will be updated after extraction
      email: '', // Will be updated after extraction
      phone: '', // Will be updated after extraction
      location: '', // Will be updated after extraction
      user_id: userId,
      s3Url: '', // Will be updated with actual S3 URL
    });

    return cv;
  }
}