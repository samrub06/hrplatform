import { AuthDAL, UserWithPermissions } from '@/lib/dal/auth';

interface PermissionGuardProps {
  children: React.ReactNode;
  requiredPermission?: {
    domain: string;
    action: 'read' | 'create' | 'edit' | 'delete';
  };
  requiredRole?: string;
  fallback?: React.ReactNode;
}

export default async function PermissionGuard({ 
  children, 
  requiredPermission,
  requiredRole,
  fallback = <div>Accès non autorisé</div>
}: PermissionGuardProps) {
  // Get user session with permissions
  const user = await AuthDAL.getUser();

  if (!user) {
    return fallback;
  }

  // Check if user has permissions data
  if (!user.permissions) {
    return fallback;
  }

  // Create UserWithPermissions object
  const userWithPermissions: UserWithPermissions = {
    id: user.userId,
    email: user.email || '',
    role: user.role || '',
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    permissions: user.permissions
  };

  // Check role if required
  if (requiredRole && user.role !== requiredRole) {
    return fallback;
  }

  // Check permission if required
  if (requiredPermission) {
    const hasPermission = AuthDAL.hasPermission(
      userWithPermissions, 
      requiredPermission.domain, 
      requiredPermission.action
    );

    if (!hasPermission) {
      return fallback;
    }
  }

  return <>{children}</>;
}

// Higher-order component for client-side permission checking
export function withPermission<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  requiredPermission?: {
    domain: string;
    action: 'read' | 'create' | 'edit' | 'delete';
  },
  requiredRole?: string
) {
  return function PermissionWrappedComponent(props: P) {
    return (
      <PermissionGuard 
        requiredPermission={requiredPermission}
        requiredRole={requiredRole}
      >
        <WrappedComponent {...props} />
      </PermissionGuard>
    );
  };
} 