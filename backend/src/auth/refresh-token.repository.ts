import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { RefreshToken } from '../models/token.model';

@Injectable()
export class RefreshTokenRepository {
  constructor(
    @InjectModel(RefreshToken)
    private refreshTokenModel: typeof RefreshToken,
  ) {}

  async create(data: {
    token: string;
    userId: string;
    expiresAt: Date;
  }): Promise<RefreshToken> {
    return this.refreshTokenModel.create(data);
  }

  async findByToken(token: string): Promise<RefreshToken | null> {
    return this.refreshTokenModel.findOne({
      where: { token },
      include: ['user'],
    });
  }

  async findByUserId(userId: string): Promise<RefreshToken | null> {
    return this.refreshTokenModel.findOne({
      where: { userId },
      include: ['user'],
    });
  }

  async revokeAllUserTokens(userId: string): Promise<number> {
    const result = await this.refreshTokenModel.update(
      { isRevoked: true },
      {
        where: {
          userId,
          isRevoked: false,
        },
      },
    );

    return result[0]; // Retourne le nombre de tokens révoqués
  }
}
