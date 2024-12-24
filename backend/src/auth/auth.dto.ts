export class RegisterDto {
  password: string;
  password_confirmation: string;
  email: string;
  first_name: string;
  last_name: string;
  role_id: string;
}

export class LoginDto {
  email: string;
  password: string;
}
