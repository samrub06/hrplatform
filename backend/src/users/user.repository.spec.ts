import { getModelToken } from '@nestjs/sequelize';
import { Test } from '@nestjs/testing';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { AdminNote } from '../admin/models/admin-note.model';
import { Admin } from '../admin/models/admin.model';
import { Permission } from '../models/permission.model';
import { RolePermission } from '../models/role-permission.model';
import { Role } from '../models/role.model';
import { CreateUserRequestDto } from './commands/create-user.command.request.dto';
import { User } from './models/user.model';
import { UserRepository } from './user.repository';

describe('UserRepository Integration Tests', () => {
  let repository: UserRepository;
  let sequelize: Sequelize;

  const testUsers = [
    {
      email: 'user1@test.com',
      first_name: 'User',
      last_name: 'One',
      password: 'password123',
      role_id: 'role-123',
    },
    {
      email: 'user2@test.com',
      first_name: 'User',
      last_name: 'Two',
      password: 'password123',
      role_id: 'role-123',
    },
    {
      email: 'user3@test.com',
      first_name: 'User',
      last_name: 'Three',
      password: 'password123',
      role_id: 'role-123',
    },
  ];

  beforeAll(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([
      User,
      AdminNote,
      Admin,
      Role,
      RolePermission,
      Permission,
    ]);
    await sequelize.sync();

    const module = await Test.createTestingModule({
      providers: [
        UserRepository,
        {
          provide: getModelToken(User),
          useValue: User,
        },
      ],
    }).compile();

    repository = module.get<UserRepository>(UserRepository);
  });

  beforeEach(async () => {
    await User.destroy({ where: {}, truncate: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('Opérations CRUD', () => {
    it('devrait créer un utilisateur', async () => {
      // Arrange
      const createUserDto: CreateUserRequestDto = {
        email: 'test@example.com',
        password: 'password123',
        password_confirmation: 'password123',
        first_name: 'Test',
        last_name: 'User',
        role_id: 'role-123',
      };

      // Act
      const user = await repository.create(createUserDto);

      // Assert
      expect(user).toBeDefined();
      expect(user.email).toBe(createUserDto.email);
      expect(user.first_name).toBe(createUserDto.first_name);
    });

    it('devrait trouver un utilisateur par email', async () => {
      // Arrange
      const testUser = await User.create(testUsers[0]);

      // Act
      const foundUser = await repository.findByEmail(testUser.email);

      // Assert
      expect(foundUser).toBeDefined();
      expect(foundUser?.email).toBe(testUser.email);
    });
  });

  describe('Requêtes de pagination et tri', () => {
    beforeEach(async () => {
      // Créer des utilisateurs de test
      await User.bulkCreate(testUsers);
    });

    it('devrait paginer les résultats', async () => {
      // Act
      const filters = {
        limit: 2,
        offset: 0,
      };
      const users = await repository.findAll(filters);

      // Assert
      expect(users).toHaveLength(2);
    });

    it('devrait trier les utilisateurs par date de création DESC', async () => {
      // Act
      const users = await repository.findAll({
        order: [['createdAt', 'DESC']],
      });

      // Assert
      expect(users).toHaveLength(3);
      const dates = users.map((user) => user.createdAt);
      expect(dates).toEqual(
        [...dates].sort((a, b) => b.getTime() - a.getTime()),
      );
    });

    it('devrait filtrer les utilisateurs par prénom', async () => {
      // Act
      const users = await repository.findAll({
        where: { first_name: 'User' },
      });

      // Assert
      expect(users).toHaveLength(3);
      users.forEach((user) => {
        expect(user.first_name).toBe('User');
      });
    });
  });

  describe('Recherche avancée', () => {
    beforeEach(async () => {
      await User.bulkCreate(testUsers);
    });

    it('devrait rechercher des utilisateurs avec des critères multiples', async () => {
      // Act
      const users = await repository.findAll({
        where: {
          first_name: 'User',
          last_name: 'One',
        },
      });

      // Assert
      expect(users).toHaveLength(1);
      expect(users[0].last_name).toBe('One');
    });

    it('devrait supporter la recherche partielle par email', async () => {
      // Act
      const users = await repository.findAll({
        where: {
          email: {
            [Op.like]: '%@test.com',
          },
        },
      });

      // Assert
      expect(users).toHaveLength(3);
    });
  });

  describe('Gestion des erreurs', () => {
    it('devrait gérer les erreurs de création avec email en double', async () => {
      // Arrange
      await User.create(testUsers[0]);

      // Act & Assert
      await expect(User.create(testUsers[0])).rejects.toThrow();
    });

    it('devrait retourner null pour un utilisateur non trouvé', async () => {
      // Act
      const user = await repository.findById('non-existent-id');

      // Assert
      expect(user).toBeNull();
    });
  });
});
