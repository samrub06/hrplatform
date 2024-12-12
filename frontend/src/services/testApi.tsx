import { HRPlatformApi, LoginRequestDto } from "@orensof/api-client";

export async function testSDK() {
  try {
    const api = new HRPlatformApi({
      BASE: 'http://localhost:3000'
    });

    const loginData: LoginRequestDto = {
      email: 'samuel@gmail.com',
      password: 'samuel'
    };

    const response = await api.auth.login({ requestBody: loginData });
    console.log('Login réussi:', response);
  } catch (error) {
    console.error('Erreur:', error);
  }
}