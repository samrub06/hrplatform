import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { Role } from 'src/enums/role.enum';
import { CreateUserCommand } from './commands/create-user.command';
import { RemoveUserCommand } from './commands/remove-user.command';
import { UpdateUserCommand } from './commands/update-user.command';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindAllUsersQuery } from './queries/getAllUser.query';
import { FindUserByIdQuery } from './queries/getUserById.query';
import { UsersController } from './users.controller';

describe('UsersController', () => {
  let controller: UsersController;
  let commandBus: CommandBus;
  let queryBus: QueryBus;

  const mockUser = {
    id: 1,
    first_name: 'John',
    last_name: 'Doe',
    email: 'john@example.com',
    role: Role.CANDIDATE,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: CommandBus,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: QueryBus,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    commandBus = module.get<CommandBus>(CommandBus);
    queryBus = module.get<QueryBus>(QueryBus);
  });

  describe('create', () => {
    it('devrait créer un nouvel utilisateur', async () => {
      const createUserDto: CreateUserDto = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        password: 'password123',
        password_confirmation: 'password123',
        role: Role.CANDIDATE,
      };

      jest.spyOn(commandBus, 'execute').mockResolvedValue(mockUser);

      const result = await controller.create(createUserDto);

      expect(commandBus.execute).toHaveBeenCalledWith(
        new CreateUserCommand(createUserDto),
      );
      expect(result).toEqual(mockUser);
    });

    it('devrait lever une BadRequestException pour un email invalide', async () => {
      const createUserDto: CreateUserDto = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'invalid-email',
        password: 'password123',
        password_confirmation: 'password123',
        role: Role.CANDIDATE,
      };

      jest
        .spyOn(commandBus, 'execute')
        .mockRejectedValue(new BadRequestException('Invalid email'));

      await expect(controller.create(createUserDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAll', () => {
    it('devrait retourner tous les utilisateurs', async () => {
      const users = [mockUser];
      jest.spyOn(queryBus, 'execute').mockResolvedValue(users);

      const result = await controller.findAll();

      expect(queryBus.execute).toHaveBeenCalledWith(new FindAllUsersQuery());
      expect(result).toEqual(users);
    });
  });

  describe('findOne', () => {
    it('devrait retourner un utilisateur par son ID', async () => {
      jest.spyOn(queryBus, 'execute').mockResolvedValue(mockUser);

      const result = await controller.findOne(1);

      expect(queryBus.execute).toHaveBeenCalledWith(new FindUserByIdQuery('1'));
      expect(result).toEqual(mockUser);
    });

    it('devrait lever une NotFoundException pour un ID inexistant', async () => {
      jest
        .spyOn(queryBus, 'execute')
        .mockRejectedValue(new NotFoundException('User not found'));

      await expect(controller.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('devrait mettre à jour un utilisateur', async () => {
      const updateUserDto: UpdateUserDto = {
        first_name: 'John Updated',
        email: 'john@example.com',
        last_name: 'Doe',
        password: 'password123',
        role: Role.USCANDIDATEER,
        skills: [],
        cv: '',
        updateAt: undefined,
      };

      const updatedUser = { ...mockUser, ...updateUserDto };
      jest.spyOn(commandBus, 'execute').mockResolvedValue(updatedUser);

      const result = await controller.update('1', updateUserDto);

      expect(commandBus.execute).toHaveBeenCalledWith(
        new UpdateUserCommand(1, updateUserDto),
      );
      expect(result).toEqual(updatedUser);
    });

    it('devrait lever une NotFoundException pour un ID inexistant', async () => {
      const updateUserDto: UpdateUserDto = {
        first_name: 'John Updated',
        email: 'john@example.com',
        last_name: 'Doe',
        password: 'password123',
        role: Role.CANDIDATE,
        skills: [],
        cv: '',
        updateAt: undefined,
      };

      jest
        .spyOn(commandBus, 'execute')
        .mockRejectedValue(new NotFoundException('User not found'));

      await expect(controller.update('999', updateUserDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('devrait supprimer un utilisateur', async () => {
      const successMessage = 'User successfully deleted';
      jest.spyOn(commandBus, 'execute').mockResolvedValue(successMessage);

      const result = await controller.remove('1');

      expect(commandBus.execute).toHaveBeenCalledWith(new RemoveUserCommand(1));
      expect(result).toEqual(successMessage);
    });

    it('devrait lever une NotFoundException pour un ID inexistant', async () => {
      jest
        .spyOn(commandBus, 'execute')
        .mockRejectedValue(new NotFoundException('User not found'));

      await expect(controller.remove('999')).rejects.toThrow(NotFoundException);
    });
  });
});
