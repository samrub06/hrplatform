import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AdminRepository } from '../admin.repository';

export class DeleteAdminNoteCommand {
  constructor(public readonly id: string) {}
}

@CommandHandler(DeleteAdminNoteCommand)
export class DeleteAdminNoteHandler
  implements ICommandHandler<DeleteAdminNoteCommand>
{
  constructor(private readonly adminRepository: AdminRepository) {}

  async execute(command: DeleteAdminNoteCommand): Promise<void> {
    const { id } = command;
    await this.adminRepository.deleteNote(id);
  }
}
