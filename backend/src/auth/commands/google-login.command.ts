import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../../users/user.repository';
import { LoginResponseDto } from '../dto/login.response.dto';
import { RefreshTokenRepository } from '../refresh-token.repository';

export class GoogleLoginCommand {
  constructor(
    public readonly request: {
      email: string;
      firstName: string;
      lastName: string;
      googleId: string;
      picture: string;
    },
  ) {}
}

@CommandHandler(GoogleLoginCommand)
export class GoogleLoginHandler
  implements ICommandHandler<GoogleLoginCommand, LoginResponseDto>
{
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}

  async execute(command: GoogleLoginCommand): Promise<LoginResponseDto> {
    const { request } = command;
    
    let user = await this.userRepository.findByEmail(request.email);

    if (!user) {
      user = await this.userRepository.create({
        email: request.email,
        first_name: request.firstName,
        last_name: request.lastName,
        profilePicture: request.picture,
        googleId: request.googleId,
      });
    } else if (!user.googleId) {
      await this.userRepository.update(user.id, {
        googleId: request.googleId,
      });
    }

    const payload = {
      email: user.email,
      id: user.id,
      roleId: user.role_id || null,
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

    const response = {
      accessToken: access_token,
      refreshToken: refresh_token,
      userId: user.id,
    };


    return response;
  }
}
