import { UnauthorizedException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/app.enum';
import { UserRepository } from '../../users/user.repository';
import { LoginRequestDto } from '../dto/login.request.dto';
import { LoginResponseDto } from '../dto/login.response.dto';
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

    const isPasswordValid = await bcrypt.compare(
      request.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Password is invalid');
    }

    const payload = {
      email: user.email,
      id: user.id,
      role: Role.CANDIDATE,
      role_id: user.role_id,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
