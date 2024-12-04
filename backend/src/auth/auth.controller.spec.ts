import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { LoginDto, RegisterDto } from './auth.dto';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('devrait créer un nouvel utilisateur et retourner un token', async () => {
      const registerDto: RegisterDto = {
        email: 'test@example.com',
        password: 'password123',
        password_confirmation: 'password123',
        role: 'user',
      };

      const expectedResponse = {
        access_token: 'mock_token',
      };

      mockAuthService.register.mockResolvedValue(expectedResponse);

      const result = await controller.register(registerDto);

      expect(result).toEqual(expectedResponse);
      expect(authService.register).toHaveBeenCalledWith(registerDto);
    });

    it('devrait lever une UnauthorizedException si les mots de passe ne correspondent pas', async () => {
      const registerDto: RegisterDto = {
        email: 'test@example.com',
        password: 'password123',
        password_confirmation: 'different_password',
        role: 'user',
      };

      mockAuthService.register.mockRejectedValue(
        new UnauthorizedException('Passwords do not match'),
      );

      await expect(controller.register(registerDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('login', () => {
    it('devrait authentifier un utilisateur et retourner un token', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const expectedResponse = {
        access_token: 'mock_token',
      };

      mockAuthService.login.mockResolvedValue(expectedResponse);

      const result = await controller.login(loginDto);

      expect(result).toEqual(expectedResponse);
      expect(authService.login).toHaveBeenCalledWith(loginDto);
    });

    it('devrait lever une UnauthorizedException pour des identifiants invalides', async () => {
      const loginDto: LoginDto = {
        email: 'invalid@example.com',
        password: 'wrong_password',
      };

      mockAuthService.login.mockRejectedValue(
        new UnauthorizedException('Invalid credentials'),
      );

      await expect(controller.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
