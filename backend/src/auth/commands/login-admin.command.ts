import { UnauthorizedException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AdminRepository } from '../../admin/admin.repository';
import { LoginAdminRequestDto } from '../dto/login-admin.request.dto';
import { LoginResponseDto } from '../dto/login.response.dto';

export class LoginAdminCommand {
  constructor(public readonly request: LoginAdminRequestDto) {}
}

@CommandHandler(LoginAdminCommand)
export class LoginAdminHandler
  implements ICommandHandler<LoginAdminCommand, LoginResponseDto>
{
  constructor(
    private readonly adminRepository: AdminRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(command: LoginAdminCommand): Promise<LoginResponseDto> {
    const { request } = command;

    const admin = await this.adminRepository.findAdminByEmail(request.email);
    if (!admin) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    const isPasswordValid = await bcrypt.compare(
      request.password,
      admin.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Mot de passe invalide');
    }

    const payload = {
      email: admin.email,
      sub: admin.id,
      userType: 'admin',
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
