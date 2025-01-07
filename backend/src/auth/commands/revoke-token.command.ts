import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RefreshTokenRepository } from '../refresh-token.repository';

export class RevokeUserTokensCommand {
  constructor(public readonly userId: string) {}
}

@CommandHandler(RevokeUserTokensCommand)
export class RevokeUserTokensHandler
  implements ICommandHandler<RevokeUserTokensCommand>
{
  constructor(
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}

  async execute(command: RevokeUserTokensCommand): Promise<void> {
    const { userId } = command;

    const tokensRevoked =
      await this.refreshTokenRepository.revokeAllUserTokens(userId);

    if (tokensRevoked === 0) {
      throw new NotFoundException(
        'Aucun token actif trouvé pour cet utilisateur',
      );
    }
  }
}
