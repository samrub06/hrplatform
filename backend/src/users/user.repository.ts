import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CVEducation } from '../models/cv-education.model';
import { CVExperience } from '../models/cv-experience.model';
import { CVSkill } from '../models/cv-skill.model';
import { CV } from '../models/cv.model';
import { Role } from '../models/role.model';
import { User } from '../models/user.model';
import { CreateUserRequestDto } from './commands/create-user.command.request.dto';
import { UpdateUserRequestDto } from './commands/update-user.command.request.dto';

// Interface de pagination
interface PaginationOptions {
  page: number;
  limit: number;
  order?: [string, 'ASC' | 'DESC'][];
  where?: any;
}

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

  async findByIdWithCVAndSkills(id: string): Promise<User | null> {
    return this.userModel.findByPk(id, {
      include: [
        {
          model: CV,
          required: false,
          attributes: ['id', 'fileName', 'name'],
          include: [
            {
              model: CVSkill,
              as: 'skills',
              attributes: ['id', 'name'],
            },
            {
              model: CVEducation,
              as: 'education',
              attributes: ['id', 'institution', 'degree', 'fieldOfStudy', 'startDate', 'endDate', 'description'],
            },
            {
              model: CVExperience,
              as: 'experiences',
              attributes: ['id', 'title', 'company', 'startDate', 'endDate', 'isCurrent', 'description', 'location'],
            },
          ],
        },
      ],
    });
  }

  async findByPublicToken(code: string): Promise<User | null> {
    return this.userModel.findOne({
      where: { public_link_code: code },
      include: [
        {
          model: CV,
        },
      ],
    });
  }

  async update(
    id: string,
    updateUserDto: UpdateUserRequestDto,
  ): Promise<User | null> {
    const user = await this.findById(id);
    if (!user) return null;

    try {
      await user.update(updateUserDto);
      return user.reload();
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        if (error.errors?.some(e => e.path === 'email')) {
          throw new ConflictException('Email is already taken by another user');
        }
      }
      throw error;
    }
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

  async findAllWithPagination(options: PaginationOptions): Promise<{
    data: User[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const { page, limit, order, where } = options;
    const offset = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.userModel.findAll({
        where,
        limit,
        offset,
        order: order || [['createdAt', 'DESC']],
      }),
      this.userModel.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }
}
