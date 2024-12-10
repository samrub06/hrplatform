import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionService } from './permission.service';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private permissionService: PermissionService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermission = this.reflector.get<{
      domain: string;
      action: 'create' | 'read' | 'edit' | 'delete';
    }>('permission', context.getHandler());

    if (!requiredPermission) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const userId = request.user?.id; // Assurez-vous que le user est attaché à la requête via AuthGuard

    if (!userId) {
      return false;
    }

    return this.permissionService.canUserDo(
      userId,
      requiredPermission.domain,
      requiredPermission.action,
    );
  }
}
