import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AdminRepository } from '../admin.repository';
import { UpdateAdminDto } from '../dto/update-admin.dto';

export class UpdateAdminCommand {
  constructor(
    public readonly id: string,
    public readonly updateAdminDto: UpdateAdminDto,
  ) {}
}

@CommandHandler(UpdateAdminCommand)
export class UpdateAdminHandler implements ICommandHandler<UpdateAdminCommand> {
  constructor(private readonly adminRepository: AdminRepository) {}

  async execute(command: UpdateAdminCommand) {
    const { id, updateAdminDto } = command;
    return this.adminRepository.updateAdmin(id, updateAdminDto);
  }
}
