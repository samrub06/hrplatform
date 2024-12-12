import { Injectable } from '@nestjs/common';
import { LoginRequestDto } from '../dto/login.request.dto';

@Injectable()
export class LoginValidator {
  validate(request: LoginRequestDto): boolean {
    if (!request.email || !request.password) {
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(request.email)) {
      return false;
    }

    if (request.password.length < 6) {
      return false;
    }

    return true;
  }
}
