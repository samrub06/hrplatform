import { UnauthorizedException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/app.enum';
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
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      request.password,
      admin.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Password is invalid');
    }

    const payload = {
      email: admin.email,
      id: admin.id,
      role: Role.ADMIN,
    };

    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(payload),
    };
  }
}
