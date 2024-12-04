export class RegisterDto {
  password: string;
  password_confirmation: string;
  email: string;
  role: string;
}

export class LoginDto {
  email: string;
  password: string;
}
