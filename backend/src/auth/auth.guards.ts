import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from 'src/users/user.repository';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private usersRepository: UserRepository,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler(),
    );
    const request = context.switchToHttp().getRequest();

    // Vérifier si c'est une route de profil public
    if (request.params?.token && request.path.includes('profile/public')) {
      const code = request.params.token;
      const user = await this.usersRepository.findByPublicToken(code);

      if (!user) {
        throw new UnauthorizedException('Invalid public profile code');
      }

      request.user = {
        ...user,
        role: 'viewer',
        isPublicProfile: true,
      };
      return true;
    }

    // Vérification du token JWT normal
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      if (isPublic) return true;
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);
      const user = await this.usersRepository.findById(payload.sub);
      request.user = user;
      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
