import { Injectable } from '@nestjs/common';
import { SkillLevel } from '../models/job.model';
import { CreateJobRequestDto } from './create-job-command.request.dto';

@Injectable()
export class CreateJobValidator {
  validate(request: CreateJobRequestDto): boolean {
    if (request.salary_offered < 0) {
      return false;
    }

    if (request.global_year_experience < 0) {
      return false;
    }

    if (!request.skills?.length) {
      return false;
    }

    // Validation du level pour chaque skill
    for (const skill of request.skills) {
      if (!Object.values(SkillLevel).includes(skill.level)) {
        return false;
      }
    }

    return true;
  }
}
