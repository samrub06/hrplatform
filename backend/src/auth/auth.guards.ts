import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AdminRepository } from 'src/admin/admin.repository';
import { IS_PUBLIC_KEY } from 'src/casl/public.decorator';
import { UserRepository } from 'src/users/user.repository';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private usersRepository: UserRepository,
    private adminRepository: AdminRepository,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest();

    if (isPublic && !request.headers.authorization) {
      return true;
    }

    if (request.params?.token && request.path.includes('profile/public')) {
      const code = request.params.token;
      try {
        const user = await this.usersRepository.findByPublicToken(code);
        if (!user) {
          throw new UnauthorizedException('Code de profil public invalide');
        }
        request.user = {
          ...user.dataValues,
          role: 'viewer',
          isPublicProfile: true,
        };
        return true;
      } catch (error) {
        throw new UnauthorizedException('Code de profil public invalide');
      }
    }

    const token = this.extractTokenFromHeader(request);
    if (!token) {
      if (isPublic) return true;
      throw new UnauthorizedException('Token Missing');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);

      // Vérifier si c'est un admin
      if (payload.userType === 'admin') {
        const admin = await this.adminRepository.findAdminById(payload.sub);
        if (!admin) {
          throw new UnauthorizedException('Administrateur non trouvé');
        }
        request.user = {
          ...admin,
          role: 'admin',
        };
        return true;
      }

      // Si ce n'est pas un admin, chercher dans users
      const user = await this.usersRepository.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('Utilisateur non trouvé');
      }
      request.user = user;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Token invalide');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
