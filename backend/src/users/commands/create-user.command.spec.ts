import { BadRequestException, ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from '../user.repository';
import { CreateUserCommand, CreateUserHandler } from './create-user.command';
import { CreateUserValidator } from './create-user.command.validator';

describe('CreateUserHandler', () => {
  let handler: CreateUserHandler;
  let userRepository: UserRepository;
  let validator: CreateUserValidator;

  // Arrange
  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserHandler,
        {
          // Mock the UserRepository
          provide: UserRepository,
          useValue: {
            findByEmail: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          // Mock the CreateUserValidator
          provide: CreateUserValidator,
          useValue: {
            validate: jest.fn().mockReturnValue(true),
          },
        },
      ],
    }).compile();

    // Get the handler, userRepository and validator from the module
    handler = moduleRef.get<CreateUserHandler>(CreateUserHandler);
    userRepository = moduleRef.get<UserRepository>(UserRepository);
    validator = moduleRef.get<CreateUserValidator>(CreateUserValidator);
  });

  it('should create a user successfully', async () => {
    // Arrange : Prepare the mock data
    const mockUser = {
      email: 'test@test.com',
      password: 'password123',
      first_name: 'John',
      last_name: 'Doe',
      role: 'user',
    };

    // Mock the UserRepository
    userRepository.findByEmail = jest.fn().mockResolvedValue(null);
    userRepository.create = jest.fn().mockResolvedValue(mockUser);

    // Act : Execute the command
    const result = await handler.execute(new CreateUserCommand(mockUser));

    // Assert : Check the result
    expect(result).toEqual(mockUser);
    expect(userRepository.create).toHaveBeenCalledWith(mockUser);
    expect(userRepository.findByEmail).toHaveBeenCalledWith(mockUser.email);
  });

  it('should throw ConflictException when email already exists', async () => {
    // Arrange
    const mockUser = {
      email: 'existing@test.com',
      password: 'password123',
      first_name: 'John',
      last_name: 'Doe',
      role: 'user',
    };

    userRepository.findByEmail = jest.fn().mockResolvedValue(mockUser);

    // Act & Assert
    await expect(
      handler.execute(new CreateUserCommand(mockUser)),
    ).rejects.toThrow(ConflictException);
  });

  it('should throw BadRequestException when validation fails', async () => {
    // Arrange
    const mockUser = {
      email: 'invalid@test.com',
      password: 'password123',
      first_name: 'John',
      last_name: 'Doe',
      role: 'user',
    };

    validator.validate = jest.fn().mockReturnValue(false);

    // Act & Assert
    await expect(
      handler.execute(new CreateUserCommand(mockUser)),
    ).rejects.toThrow(BadRequestException);
  });
});
