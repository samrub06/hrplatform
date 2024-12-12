import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import * as bcrypt from 'bcrypt';
import { AdminRepository } from 'src/admin/admin.repository';
import { RegisterAdminRequestDto } from '../dto/register-admin.request.dto';

export class RegisterAdminCommand {
  constructor(public readonly request: RegisterAdminRequestDto) {}
}

@CommandHandler(RegisterAdminCommand)
export class RegisterAdminHandler
  implements ICommandHandler<RegisterAdminCommand>
{
  constructor(
    private readonly adminRepository: AdminRepository,
    private readonly configService: ConfigService,
  ) {}

  async execute(command: RegisterAdminCommand) {
    const { request } = command;
    const adminSecretCode = this.configService.get<string>('ADMIN_SECRET_CODE');

    if (request.secretCode !== adminSecretCode) {
      throw new UnauthorizedException('Code secret invalide');
    }

    const existingAdmin = await this.adminRepository.findAdminByEmail(
      request.email,
    );
    if (existingAdmin) {
      throw new UnauthorizedException('Cet email est déjà utilisé');
    }

    const hashedPassword = await bcrypt.hash(request.password, 10);

    return this.adminRepository.createAdmin({
      name: request.name,
      email: request.email,
      password: hashedPassword,
    });
  }
}
