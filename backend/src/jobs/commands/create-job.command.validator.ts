import { Injectable } from '@nestjs/common';
import { CreateJobRequestDto } from './create-job-command.request.dto';

@Injectable()
export class CreateJobValidator {
  validate(request: CreateJobRequestDto): boolean {
    if (request.global_year_experience < 0) {
      return false;
    }

    if (!request.skills?.length) {
      return false;
    }

    return true;
  }
}
