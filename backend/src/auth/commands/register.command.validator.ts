import { Injectable } from '@nestjs/common';
import { RegisterRequestDto } from '../dto/register.request.dto';
import {
  ValidationError,
  ValidationResult,
} from '../interface/auth.interface.validation';

@Injectable()
export class RegisterValidator {
  validate(request: RegisterRequestDto): ValidationResult {
    const errors: ValidationError[] = [];

    if (!request.email || !request.password || !request.password_confirmation) {
      errors.push({
        field: 'general',
        message: 'All fields are required',
      });
      return { isValid: false, errors };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(request.email)) {
      errors.push({
        field: 'email',
        message: 'Invalid email format',
      });
    }

    if (request.password.length < 6) {
      errors.push({
        field: 'password',
        message: 'Password must be at least 6 characters long',
      });
    }

    if (request.password !== request.password_confirmation) {
      errors.push({
        field: 'password',
        message: 'Password confirmation does not match',
      });
    }

    if (!request.first_name || !request.last_name) {
      errors.push({
        field: 'first_name',
        message: 'First name is required',
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
