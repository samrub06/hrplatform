import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from '../casl/public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 1. Verify if the routes is Public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest();

    // 2. Allow access to public routes without token
    if (isPublic && !request.headers.authorization) {
      return true;
    }

    // 3. Validate the Bearer token
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      if (isPublic) return true;
      throw new UnauthorizedException('Missing Token');
    }

    try {
      // 4. Verify the token and add the payload to the request
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

      request.user = payload;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid Token ');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    // If no cookie, verify the Bearer header
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    console.log('Header Authorization:', request.headers['authorization']);
    return type === 'Bearer' ? token : undefined;
  }
}
