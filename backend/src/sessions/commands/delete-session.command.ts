import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionsRepository } from '../sessions.repository';

export class DeleteSessionCommand {
  constructor(public readonly id: string) {}
}

@CommandHandler(DeleteSessionCommand)
export class DeleteSessionHandler
  implements ICommandHandler<DeleteSessionCommand>
{
  constructor(private readonly sessionsRepository: SessionsRepository) {}

  async execute(command: DeleteSessionCommand): Promise<number> {
    return this.sessionsRepository.delete(command.id);
  }
}
