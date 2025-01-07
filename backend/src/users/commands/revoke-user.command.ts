import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RefreshTokenRepository } from '../../auth/refresh-token.repository';
import { UserRepository } from '../user.repository';

export class RevokeUserCommand {
  constructor(
    public readonly userId: string,
    public readonly revoke: boolean,
  ) {}
}

@CommandHandler(RevokeUserCommand)
export class RevokeUserHandler implements ICommandHandler<RevokeUserCommand> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}

  async execute(command: RevokeUserCommand): Promise<void> {
    const { userId, revoke } = command;

    // Mettre à jour le statut de révocation de l'utilisateur
    await this.userRepository.updateRevocationStatus(userId, revoke);

    // Si l'utilisateur est révoqué, révoquer également tous ses tokens
    if (revoke) {
      await this.refreshTokenRepository.revokeAllUserTokens(userId);
    }
  }
}
