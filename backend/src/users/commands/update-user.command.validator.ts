import { Injectable } from '@nestjs/common';
import { UpdateUserRequestDto } from './update-user.command.request.dto';

@Injectable()
export class UpdateUserValidator {
  validate(request: UpdateUserRequestDto): boolean {
    if (request.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(request.email)) {
        return false;
      }
    }

    if (request.password && request.password.length < 6) {
      return false;
    }

    return true;
  }
}
