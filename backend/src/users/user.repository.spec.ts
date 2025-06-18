import { Sequelize } from 'sequelize-typescript';
import { AdminNote } from '../models/admin-note.model';
import { Admin } from '../models/admin.model';
import { CVEducation } from '../models/cv-education.model';
import { CVSkill } from '../models/cv-skill.model';
import { CV } from '../models/cv.model';
import { Email } from '../models/email_logs.model';
import { Job } from '../models/job.model';
import { Permission } from '../models/permission.model';
import { RolePermission } from '../models/role-permission.model';
import { Role } from '../models/role.model';
import { SessionUser } from '../models/sessionUser.model';
import { RefreshToken } from '../models/token.model';
import { User } from '../models/user.model';
import { UserRepository } from './user.repository';

describe('UserRepository Integration Tests', () => {
  let userRepository: UserRepository;
  let sequelize: Sequelize;

  const testUsers = [
    {
      email: 'user1@test.com',
      first_name: 'User',
      last_name: 'One',
      password: 'password123',
      role_id: 'role-123',
      isRevoked: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      email: 'user2@test.com',
      first_name: 'User',
      last_name: 'Two',
      password: 'password123',
      role_id: 'role-123',
      isRevoked: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      email: 'user3@test.com',
      first_name: 'User',
      last_name: 'Three',
      password: 'password123',
      role_id: 'role-123',
      isRevoked: false,
      createdAt: new Date(),
      updatedAt: new Date(),
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
      CV,
      Admin,
      Role,
      Permission,
      AdminNote,
      RolePermission,
      Job,
      CVEducation,
      CVSkill,
      RefreshToken,
      Email,
      SessionUser,
    ]);
    await sequelize.sync();

    // Create a repository instance
    userRepository = new UserRepository(User);

    // Create a test role
    await Role.create({
      id: 'role-123',
      name: 'test-role',
      description: 'Test role',
    });
  });

  beforeEach(async () => {
    await User.destroy({ where: {}, truncate: true });
    // Create test users
    for (const user of testUsers) {
      try {
        await userRepository.create(user);
      } catch (e) {
        console.error('Error creating user:', user, e);
        throw e;
      }
    }
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('CRUD operations', () => {
    it('should create a user', async () => {
      // Arrange
      const createUserDto = {
        email: 'test@test.com',
        first_name: 'John',
        last_name: 'Doe',
        password: 'password123',
      };

      // Act
      const user = await userRepository.create(createUserDto);

      // Assert
      expect(user).toBeDefined();
      expect(user.email).toBe(createUserDto.email);
    });

    it('devrait trouver un utilisateur par email', async () => {
      // Arrange
      const createUserDto = {
        email: 'test@test.com',
        first_name: 'John',
        last_name: 'Doe',
        password: 'password123',
      };
      await userRepository.create(createUserDto);

      // Act
      const foundUser = await userRepository.findByEmail(createUserDto.email);

      // Assert
      expect(foundUser).toBeDefined();
      expect(foundUser?.email).toBe(createUserDto.email);
    });
  });

  describe('Error handling', () => {
    it('should return null for a non-existent user', async () => {
      // Act
      const user = await userRepository.findById('non-existent-id');

      // Assert
      expect(user).toBeNull();
    });
  });

  describe('Pagination', () => {
    it('should paginate users', async () => {
      // Arrange
      const paginationOptions = {
        page: 1,
        limit: 2,
      };

      // Act
      const result =
        await userRepository.findAllWithPagination(paginationOptions);

      // Assert
      expect(result.data.length).toBe(2);
      expect(result.total).toBe(3);
      expect(result.page).toBe(1);
      expect(result.totalPages).toBe(2);
    });
  });
});
