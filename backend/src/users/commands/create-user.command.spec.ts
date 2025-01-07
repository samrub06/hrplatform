import { BadRequestException, ConflictException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { UserRepository } from '../user.repository';
import { CreateUserCommand, CreateUserHandler } from './create-user.command';
import { CreateUserValidator } from './create-user.commande.validator';

describe('CreateUserHandler', () => {
  let handler: CreateUserHandler;
  let mockUserRepository: jest.Mocked<UserRepository>;
  let mockValidator: jest.Mocked<CreateUserValidator>;

  const mockCreateUserRequest = {
    email: 'test@example.com',
    password: 'password123',
    password_confirmation: 'password123',
    first_name: 'John',
    last_name: 'Doe',
    role_id: 'role-123',
  };

  beforeEach(async () => {
    mockUserRepository = {
      findByEmail: jest.fn(),
      create: jest.fn(),
    } as any;

    mockValidator = {
      validate: jest.fn(),
    } as any;

    const moduleRef = await Test.createTestingModule({
      providers: [
        CreateUserHandler,
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
        {
          provide: CreateUserValidator,
          useValue: mockValidator,
        },
      ],
    }).compile();

    handler = moduleRef.get<CreateUserHandler>(CreateUserHandler);
  });

  describe('execute', () => {
    it('need to create a user', async () => {
      // Arrange
      const expectedUser = { id: '1', ...mockCreateUserRequest };
      mockValidator.validate.mockReturnValue(true);
      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockUserRepository.create.mockResolvedValue(expectedUser as any);

      // Act
      const result = await handler.execute(
        new CreateUserCommand(mockCreateUserRequest),
      );

      // Assert
      expect(result).toEqual(expectedUser);
      expect(mockValidator.validate).toHaveBeenCalledWith(
        mockCreateUserRequest,
      );
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
        mockCreateUserRequest.email,
      );
      expect(mockUserRepository.create).toHaveBeenCalledWith(
        mockCreateUserRequest,
      );
    });

    it('need to throw a BadRequestException if the validation fails', async () => {
      // Arrange
      mockValidator.validate.mockReturnValue(false);
      mockUserRepository.findByEmail.mockClear();
      mockUserRepository.create.mockClear();

      // Act & Assert
      await expect(
        handler.execute(new CreateUserCommand(mockCreateUserRequest)),
      ).rejects.toThrow(BadRequestException);

      expect(mockValidator.validate).toHaveBeenCalledWith(
        mockCreateUserRequest,
      );
      expect(mockUserRepository.findByEmail).not.toHaveBeenCalled();
      expect(mockUserRepository.create).not.toHaveBeenCalled();
    });

    it('need to throw a ConflictException if the email already exists', async () => {
      // Arrange
      mockValidator.validate.mockReturnValue(true);
      mockUserRepository.findByEmail.mockResolvedValue({
        id: '2',
        email: mockCreateUserRequest.email,
      } as any);
      mockUserRepository.create.mockClear();

      // Act & Assert
      await expect(
        handler.execute(new CreateUserCommand(mockCreateUserRequest)),
      ).rejects.toThrow(ConflictException);

      expect(mockValidator.validate).toHaveBeenCalledWith(
        mockCreateUserRequest,
      );
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
        mockCreateUserRequest.email,
      );
      expect(mockUserRepository.create).not.toHaveBeenCalled();
    });
  });
});
