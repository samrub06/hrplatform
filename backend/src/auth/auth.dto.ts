export class RegisterDto {
  password: string;
  password_confirmation: string;
  email: string;
  first_name: string;
  last_name: string;
}

export class LoginDto {
  email: string;
  password: string;
}
