import axiosInstance from "../utils/axiosInstance";

export interface RegisterRequestDto {
  email: string;
  password: string;
  password_confirmation: string;
}
export interface LoginRequestDto {
  email: string;
  password: string;
}

export const Login = async (loginData: LoginRequestDto) => {
  const response = await axiosInstance.post('/auth/login', loginData);
  return response.data;
};

export const Register = async (registerData: RegisterRequestDto) => {
  const response = await axiosInstance.post('/auth/register', registerData);
  return response.data;
};