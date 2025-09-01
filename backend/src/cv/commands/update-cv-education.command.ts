import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CVRepository } from './../cv.repository';
import { UpdateCVEducationRequestDto } from './update-cv-education.request.command.dto';

@Injectable()
export class UpdateCVEducationCommand {
  constructor(
    public readonly userId: string,
    public readonly education: UpdateCVEducationRequestDto[],
  ) {}
}

@CommandHandler(UpdateCVEducationCommand)
export class UpdateCVEducationCommandHandler
  implements ICommandHandler<UpdateCVEducationCommand>
{
  constructor(private readonly cvRepository: CVRepository) {}

  async execute(command: UpdateCVEducationCommand) {
    const { userId, education } = command;

    if (!userId) {
      throw new BadRequestException('UserId is required');
    }

    if (!Array.isArray(education) || education.length === 0) {
      throw new BadRequestException('At least one education is required');
    }

    // Validation des dates
    for (const edu of education) {
      if (edu.endDate && edu.startDate > edu.endDate) {
        throw new BadRequestException(
          'The start date must be before the end date',
        );
      }
    }

    const cv = await this.cvRepository.findEducationByUserId(userId);
    if (!cv) {
      throw new NotFoundException(`CV for user ${userId} not found`);
    }

    const updatedEducation = await this.cvRepository.updateEducation(
      cv.id,
      education,
    );
    return updatedEducation;
  }
}
