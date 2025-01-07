import { Injectable } from '@nestjs/common';
import { CreateAdminRequestDto } from './create-admin-command.request.dto';

@Injectable()
export class CreateAdminValidator {
  validate(request: CreateAdminRequestDto): boolean {
    if (!request.name || !request.password) {
      return false;
    }

    if (request.password.length < 6) {
      return false;
    }

    return true;
  }
}
