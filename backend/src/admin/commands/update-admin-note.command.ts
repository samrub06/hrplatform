import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AdminRepository } from '../admin.repository';

export class UpdateAdminNoteCommand {
  constructor(
    public readonly id: string,
    public readonly content: string,
  ) {}
}

@CommandHandler(UpdateAdminNoteCommand)
export class UpdateAdminNoteHandler
  implements ICommandHandler<UpdateAdminNoteCommand>
{
  constructor(private readonly adminRepository: AdminRepository) {}

  async execute(command: UpdateAdminNoteCommand) {
    const { id, content } = command;
    return this.adminRepository.updateNote(id, content);
  }
}
