import { DefaultService, RegisterDto } from '@orensof/api-client-v2';

export const Register = async (values: RegisterDto) => {
  try {
    return await DefaultService.authControllerRegister(values);
  } catch (error) {
    throw new Error('Registration failed');
  }
};

export const Login = async (values: any) => {
  try {
    return await DefaultService.authControllerLogin(values);

  } catch (error) {
    throw new Error('Login failed');
  }
};