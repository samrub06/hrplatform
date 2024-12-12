import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserRequestDto } from './commands/create-user.command.request.dto';
import { UpdateUserRequestDto } from './commands/update-user.command.request.dto';
import { User } from './models/user.model';

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
      include: [{ all: true }],
      order: [['createdAt', 'DESC']],
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return this.userModel.findByPk(id);
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
    return user.update(updateUserDto);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.userModel.destroy({ where: { id } });
    return result > 0;
  }
}
