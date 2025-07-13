import { UnauthorizedException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserRepository } from '../../users/user.repository';
import { LoginRequestDto } from '../dto/login.request.dto';
import { LoginResponseDto } from '../dto/login.response.dto';
import { UserLoginDTO } from '../interface/auth.interface.validation';
import { RefreshTokenRepository } from '../refresh-token.repository';
import { LoginValidator } from './login.command.validator';

export class LoginCommand {
  constructor(public readonly request: LoginRequestDto) {}
}

@CommandHandler(LoginCommand)
export class LoginHandler
  implements ICommandHandler<LoginCommand, LoginResponseDto>
{
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly validator: LoginValidator,
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}

  async execute(command: LoginCommand): Promise<LoginResponseDto> {
    const { request } = command;

    if (!this.validator.validate(request)) {
      throw new UnauthorizedException('Invalid login data');
    }

    const user = await this.userRepository.findByEmail(request.email);
    if (!user) {
      throw new UnauthorizedException('this email is not registered');
    }

    if (user.isRevoked) {
      throw new UnauthorizedException('This account is revoked');
    }

    const isPasswordValid = await bcrypt.compare(
      request.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Password is invalid');
    }

    const payload : UserLoginDTO = {
      email: user.email,
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name, 
      roleId: user.role_id,

    };

    const access_token = this.jwtService.sign(payload);
    const refresh_token = this.jwtService.sign(payload, {
      expiresIn: '30d',
    });

    // Creation of the refresh token
    await this.refreshTokenRepository.create({
      token: refresh_token,
      userId: user.id,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    return {
      accessToken: access_token,
      refreshToken: refresh_token,
      userId: user.id,
    };
  }
}
