import { Injectable } from '@nestjs/common';
import { RefreshTokenRepository } from '../refresh-token.repository';

@Injectable()
export class UserRevocationService {
  constructor(
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}

  async isUserRevoked(userId: string): Promise<boolean> {
    const token = await this.refreshTokenRepository.findByUserId(userId);
    return token ? token.isRevoked : false;
  }
}
