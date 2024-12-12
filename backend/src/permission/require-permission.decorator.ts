import { SetMetadata } from '@nestjs/common';

export interface RequiredPermission {
  domain: string;
  action: 'create' | 'read' | 'edit' | 'delete';
}

export const PERMISSION_KEY = 'permission';
export const RequirePermission = (
  domain: string,
  action: 'create' | 'read' | 'edit' | 'delete',
) => SetMetadata(PERMISSION_KEY, { domain, action });

export const Public = () => SetMetadata('isPublic', true);
