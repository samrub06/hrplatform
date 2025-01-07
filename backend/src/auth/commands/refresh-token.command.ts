import { UnauthorizedException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { LoginResponseDto } from '../dto/login.response.dto';
import { RefreshTokenRepository } from '../refresh-token.repository';

export class RefreshTokenCommand {
  constructor(public readonly refreshToken: string) {}
}

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenHandler
  implements ICommandHandler<RefreshTokenCommand, LoginResponseDto>
{
  constructor(
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(command: RefreshTokenCommand): Promise<LoginResponseDto> {
    const { refreshToken } = command;

    const tokenDoc =
      await this.refreshTokenRepository.findByToken(refreshToken);
    if (!tokenDoc) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (tokenDoc.isRevoked) {
      throw new UnauthorizedException('Token revoked');
    }

    if (new Date() > tokenDoc.expiresAt) {
      throw new UnauthorizedException('Token expired');
    }

    const payload = {
      email: tokenDoc.user.email,
      id: tokenDoc.user.id,
    };

    const access_token = this.jwtService.sign(payload);

    return { access_token, refresh_token: tokenDoc.token };
  }
}
