import { Injectable } from '@nestjs/common';
import { CreateUserRequestDto } from './create-user.command.request.dto';

@Injectable()
export class CreateUserValidator {
  validate(request: CreateUserRequestDto): boolean {
    if (request.password !== request.password_confirmation) {
      return false;
    }

    if (request.password.length < 6) {
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(request.email)) {
      return false;
    }

    return true;
  }
}
