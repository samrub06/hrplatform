import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AdminRepository } from '../../admin/admin.repository';
import { LoginAdminResponseDto } from '../dto/login-admin-response.dto';
import { RegisterAdminRequestDto } from '../dto/register-admin.request.dto';

export class RegisterAdminCommand {
  constructor(public readonly request: RegisterAdminRequestDto) {}
}

@CommandHandler(RegisterAdminCommand)
export class RegisterAdminHandler
  implements ICommandHandler<RegisterAdminCommand, LoginAdminResponseDto>
{
  constructor(
    private readonly adminRepository: AdminRepository,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async execute(command: RegisterAdminCommand): Promise<LoginAdminResponseDto> {
    const { request } = command;
    const adminSecretCode = this.configService.get<string>('ADMIN_SECRET_CODE');

    if (request.secretCode !== adminSecretCode) {
      throw new UnauthorizedException('Code secret invalide');
    }

    const existingAdmin = await this.adminRepository.findAdminByEmail(
      request.email,
    );
    if (existingAdmin) {
      throw new UnauthorizedException('This email is already used');
    }

    const hashedPassword = await bcrypt.hash(request.password, 10);

    const admin = await this.adminRepository.createAdmin({
      name: request.name,
      email: request.email,
      password: hashedPassword,
    });

    const accessToken = this.jwtService.sign({
      id: admin.id,
      email: admin.email,
    });

    return { accessToken, refreshToken: accessToken };
  }
}
