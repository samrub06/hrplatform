import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../../users/user.repository';
import { LoginResponseDto } from '../dto/login.response.dto';
import { UserLoginDTO } from '../interface/auth.interface.validation';
import { RefreshTokenRepository } from '../refresh-token.repository';

export class LinkedInLoginCommand {
  constructor(
    public readonly request: {
      email: string;
      firstName: string;
      lastName: string;
      linkedinId: string;
      picture?: string;
    },
  ) {}
}

@CommandHandler(LinkedInLoginCommand)
export class LinkedInLoginHandler
  implements ICommandHandler<LinkedInLoginCommand, LoginResponseDto>
{
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}

  async execute(command: LinkedInLoginCommand): Promise<LoginResponseDto> {
    const { request } = command;
    let user = await this.userRepository.findByEmail(request.email);

    if (!user) {
      user = await this.userRepository.create({
        email: request.email,
        first_name: request.firstName,
        last_name: request.lastName,
        profilePicture: request.picture,
        linkedinId: request.linkedinId,
      });
    } else if (!user.linkedinId) {
      await this.userRepository.update(user.id, {
        linkedinId: request.linkedinId,
      });
    }

    const payload : UserLoginDTO = {
      email: user.email,
      id: user.id,
      roleId: user.role_id || null,
      firstName: user.first_name,
      lastName: user.last_name,
    };

    const access_token = this.jwtService.sign(payload);
    const refresh_token = this.jwtService.sign(payload, {
      expiresIn: '30d',
    });

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
