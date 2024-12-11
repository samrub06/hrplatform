import { PartialType } from '@nestjs/mapped-types';
import { Role } from 'src/app.enum';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  password_confirmation?: string;
  role: Role;
  skills: string[];
  cv: string;
  updateAt: Date;
}
