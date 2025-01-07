import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AdminRepository } from '../admin.repository';

export class DeleteAdminCommand {
  constructor(public readonly id: string) {}
}

@CommandHandler(DeleteAdminCommand)
export class DeleteAdminHandler implements ICommandHandler<DeleteAdminCommand> {
  constructor(private readonly adminRepository: AdminRepository) {}

  async execute(command: DeleteAdminCommand): Promise<void> {
    const { id } = command;
    await this.adminRepository.deleteAdmin(id);
  }
}
