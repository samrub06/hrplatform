import { Injectable } from '@nestjs/common';
import { RegisterRequestDto } from '../dto/register.request.dto';

@Injectable()
export class RegisterValidator {
  validate(request: RegisterRequestDto): boolean {
    if (!request.email || !request.password || !request.password_confirmation) {
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(request.email)) {
      return false;
    }

    if (request.password.length < 6) {
      return false;
    }

    if (request.password !== request.password_confirmation) {
      return false;
    }

    if (!request.first_name || !request.last_name) {
      return false;
    }

    return true;
  }
}
