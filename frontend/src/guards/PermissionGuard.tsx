import usePermission from "../hooks/usePermission";

interface PermissionGuardProps {
  domain: string;
  action: 'create' | 'read' | 'edit' | 'delete';
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const PermissionGuard: React.FC<PermissionGuardProps> = ({ 
  domain, 
  action, 
  children, 
  fallback = null 
}) => {
  const { hasPermission } = usePermission();
  
  if (!hasPermission(domain, action)) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
};

export default PermissionGuard;