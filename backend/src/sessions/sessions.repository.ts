import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { SessionUser } from '../models/sessionUser.model';
import { User } from '../models/user.model';

@Injectable()
export class SessionsRepository {
  constructor(
    @InjectModel(SessionUser)
    private sessionModel: typeof SessionUser,
  ) {}

  async create(data: Partial<SessionUser>): Promise<SessionUser> {
    return this.sessionModel.create(data);
  }

  async findById(id: string): Promise<SessionUser | null> {
    return this.sessionModel.findByPk(id, {
      include: [User],
    });
  }

  async findByUserId(userId: string): Promise<SessionUser[]> {
    return this.sessionModel.findAll({
      where: { userId },
      include: [User],
    });
  }

  async findByToken(token: string): Promise<SessionUser | null> {
    return this.sessionModel.findOne({
      where: { token },
      include: [User],
    });
  }

  async update(
    id: string,
    data: Partial<SessionUser>,
  ): Promise<[number, SessionUser[]]> {
    return this.sessionModel.update(data, {
      where: { id },
      returning: true,
    });
  }

  async delete(id: string): Promise<number> {
    return this.sessionModel.destroy({
      where: { id },
    });
  }

  async deleteByUserId(userId: string): Promise<number> {
    return this.sessionModel.destroy({
      where: { userId },
    });
  }

  async deleteExpired(): Promise<number> {
    return this.sessionModel.destroy({
      where: {
        expiresAt: {
          [Op.lt]: new Date(),
        },
      },
    });
  }
}
