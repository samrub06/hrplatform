import { SetMetadata } from '@nestjs/common';

export const RequirePermission = (
  domain: string,
  action: 'create' | 'read' | 'edit' | 'delete',
) => SetMetadata('permission', { domain, action });
