import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CVRepository } from './../cv.repository';
import { UpdateCVSkillsRequestDto } from './update-cv-skills.command.requet.dto';

@Injectable()
export class UpdateCVSkillsCommand {
  constructor(
    public readonly id: string,
    public readonly skills: UpdateCVSkillsRequestDto[],
  ) {}
}

@CommandHandler(UpdateCVSkillsCommand)
export class UpdateCVSkillsCommandHandler
  implements ICommandHandler<UpdateCVSkillsCommand>
{
  constructor(private readonly cvRepository: CVRepository) {}

  async execute(command: UpdateCVSkillsCommand) {
    const { id, skills } = command;

    if (!id) {
      throw new BadRequestException('UserId is required');
    }

    if (!Array.isArray(skills) || skills.length === 0) {
      throw new BadRequestException('At least one skill is required');
    }

    /*    for (const skill of skills) {
      if (!Object.values(ProgrammingLanguage).includes(skill.name)) {
        throw new BadRequestException(
          `The skill "${skill.name}" is not a valid skill`,
        );
      }

      if (skill.yearsOfExperience < 0) {
        throw new BadRequestException(
          'The years of experience cannot be negative',
        );
      }
    }
 */
    const cv = await this.cvRepository.findSkillsByUserId(id);
    if (!cv) {
      throw new NotFoundException(`CV for user ${id} not found`);
    }
    await this.cvRepository.updateSkills(cv.id, skills);
  }
}
