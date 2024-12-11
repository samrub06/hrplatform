import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AdminRepository } from '../admin.repository';
import { CreateAdminNoteRequestDto } from './create-admin-note-command.request.dto';

export class CreateAdminNoteCommand {
  constructor(public readonly request: CreateAdminNoteRequestDto) {}
}

@CommandHandler(CreateAdminNoteCommand)
export class CreateAdminNoteHandler
  implements ICommandHandler<CreateAdminNoteCommand>
{
  constructor(private readonly adminRepository: AdminRepository) {}

  async execute(command: CreateAdminNoteCommand) {
    const { request } = command;
    return this.adminRepository.createNote(request);
  }
}
