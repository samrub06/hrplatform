import { Permission } from '../dal/auth';
import { useAuth } from './useAuth';

export function usePermissions() {
  const { user } = useAuth();

  const hasPermission = (domain: string, action: 'read' | 'create' | 'edit' | 'delete'): boolean => {
    if (!user?.permissions) return false;

    const permission = user.permissions.find(p => p.domain === domain);
    if (!permission) return false;

    switch (action) {
      case 'read':
        return permission.can_read;
      case 'create':
        return permission.can_create;
      case 'edit':
        return permission.can_edit;
      case 'delete':
        return permission.can_delete;
      default:
        return false;
    }
  };

  const getPermissionsForDomain = (domain: string): Permission | undefined => {
    if (!user?.permissions) return undefined;
    return user.permissions.find(p => p.domain === domain);
  };

  return {
    hasPermission,
    getPermissionsForDomain,
    permissions: user?.permissions || [],
  };
} 