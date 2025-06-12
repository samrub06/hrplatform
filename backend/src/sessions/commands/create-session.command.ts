import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { sessionRequestDto } from '../../auth/dto/session.request.dto';
import { SessionUser } from '../../models/sessionUser.model';
import { SessionsRepository } from '../sessions.repository';

export class CreateSessionCommand {
  constructor(public readonly request: sessionRequestDto) {}
}

@CommandHandler(CreateSessionCommand)
export class CreateSessionHandler
  implements ICommandHandler<CreateSessionCommand>
{
  constructor(private readonly sessionsRepository: SessionsRepository) {}

  async execute(command: CreateSessionCommand): Promise<SessionUser> {
    const { userId, token, ipAddress, userAgent } = command.request;
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // Session expire après 24h

    return this.sessionsRepository.create({
      userId: userId,
      token: token,
      ipAddress: ipAddress,
      userAgent: userAgent,
      expiresAt,
      lastAccess: new Date(),
      isActive: true,
    });
  }
}
