import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Role } from 'src/models/role.model';
import { CV } from '../models/cv.model';
import { User } from '../models/user.model';
import { CreateUserRequestDto } from './commands/create-user.command.request.dto';
import { UpdateUserRequestDto } from './commands/update-user.command.request.dto';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async create(createUserDto: CreateUserRequestDto): Promise<User> {
    return this.userModel.create({
      ...createUserDto,
    } as any);
  }

  async findAll(filters: any = {}): Promise<User[]> {
    return this.userModel.findAll({
      where: filters,
      /* include: [{ all: true }], */
      order: [['createdAt', 'DESC']],
    });
  }

  async findAllAlumni(): Promise<User[]> {
    return this.userModel.findAll({
      include: [
        {
          model: Role,
          where: {
            name: 'publisher',
          },
        },
      ],
      order: [['createdAt', 'DESC']],
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return this.userModel.findByPk(id, {
      include: [
        {
          model: CV,
          required: false,
          attributes: ['id', 'fileName', 'name'],
        },
      ],
    });
  }

  async findByPublicToken(code: string): Promise<User | null> {
    return this.userModel.findOne({ where: { public_link_code: code } });
  }

  async update(
    id: string,
    updateUserDto: UpdateUserRequestDto,
  ): Promise<User | null> {
    const user = await this.findById(id);
    if (!user) return null;

    await user.update(updateUserDto);
    return user.reload();
  }

  async updateRole(id: string, role: any): Promise<User | null> {
    const { role: roleName } = role;
    const roleRepository = await Role.findOne({ where: { name: roleName } });
    if (!roleRepository) return null;

    const user = await this.findById(id);
    if (!user) return null;

    await user.update({ role_id: roleRepository.id });
    return user.reload();
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.userModel.destroy({ where: { id } });
    return result > 0;
  }

  async updateRevocationStatus(
    userId: string,
    isRevoked: boolean,
  ): Promise<void> {
    await this.userModel.update({ isRevoked }, { where: { id: userId } });
  }
}
