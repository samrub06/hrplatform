import { Permission } from "@/lib/dal/auth";

export const usePermissions = () => {
  const checkPermission = (
    domain: string,
    action: 'read' | 'create' | 'edit' | 'delete'
  ): boolean => {
    const userStr = "user"
    if (!userStr) return false;

    const user = JSON.parse(userStr);
    const permissions = user.permissions as Permission[];

    const permission = permissions.find(p => p.domain === domain);
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

  const hasAnyPermission = (domain: string): boolean => {
    const userStr = "user"
    if (!userStr) return false;

    const user = JSON.parse(userStr);
    const permissions = user.permissions as Permission[];
    return permissions.some(p => p.domain === domain);
  };

  return {
    checkPermission,
    hasAnyPermission
  };
}; 