import { BadRequestException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { v4 as uuidv4 } from 'uuid';
import { AdminRepository } from '../admin.repository';
import { CreateAdminRequestDto } from './create-admin-command.request.dto';
import { CreateAdminResponseDto } from './create-admin-note-command.response.dto';
import { CreateAdminValidator } from './create-admin.command.validator';

export class CreateAdminCommand {
  constructor(public readonly request: CreateAdminRequestDto) {}
}

@CommandHandler(CreateAdminCommand)
export class CreateAdminHandler
  implements ICommandHandler<CreateAdminCommand, CreateAdminResponseDto>
{
  constructor(
    private readonly adminRepository: AdminRepository,
    private readonly validator: CreateAdminValidator,
  ) {}

  async execute(command: CreateAdminCommand): Promise<CreateAdminResponseDto> {
    const { request } = command;

    if (!this.validator.validate(request)) {
      throw new BadRequestException('Invalid admin data');
    }

    const admin = await this.adminRepository.createAdmin({
      ...request,
      id: uuidv4(),
    });

    return admin;
  }
}
