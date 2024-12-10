import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Repository } from 'sequelize-typescript';
import { Role } from 'src/enums/role.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './models/user.model';
export const IUserServiceKey = Symbol('IUserService');

export interface IUserService {
  create(createUserDto: CreateUserDto): Promise<User>;
  findAll(): Promise<User[]>;
  findOne(id: number): Promise<User>;
  findOneByName(username: string): Promise<User | undefined>;
  update(id: number, updateUserDto: UpdateUserDto): Promise<void>;
  remove(id: number): Promise<string>;
  delete(id: number): Promise<number>;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private usersModel: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.usersModel.findOne({
      where: { email: createUserDto.email },
    });
    if (existingUser) {
      throw new ConflictException(
        `Email ${createUserDto.email} already exists.`,
      );
    }

    const savedUser = await this.usersModel.create({
      ...createUserDto,
      role: createUserDto.role as Role,
    });
    return savedUser;
  }

  async findAll(): Promise<User[]> {
    return this.usersModel.findAll();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersModel.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }
    return user;
  }

  async findOneByName(email: string): Promise<User | undefined> {
    return this.usersModel.findOne({ where: { email } }); // Utilise findOne avec une condition
  }

  async addAdminNote(userId: number, note: string): Promise<User> {
    const user = await this.usersModel.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }

    // Utiliser la méthode update de Sequelize
    await this.usersModel.update(
      { adminNotes: note },
      { where: { id: userId } },
    );

    // Récupérer l'utilisateur mis à jour
    return await this.usersModel.findOne({ where: { id: userId } });
  }

  async remove(id: number): Promise<string> {
    const result = await this.usersModel.destroy({ where: { id } }); // Modifié pour utiliser un objet d'options
    if (result === 0) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }
    return `User with ID ${id} has been successfully removed.`; // Message de succès
  }

  async getUsersByRole(role: Role): Promise<User[]> {
    return this.usersModel.findAll({
      where: { role },
      attributes: ['id', 'email', 'first_name', 'last_name', 'role'],
    });
  }

  async delete(id: number): Promise<number> {
    const result = await this.usersModel.destroy({ where: { id } });
    return result;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.usersModel.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }
    await this.usersModel.update(updateUserDto, { where: { id } });
    return user;
  }
}
