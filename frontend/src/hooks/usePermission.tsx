import { useAuth } from "../context/AuthContext";

const usePermission = () => {
  const { user, checkPermission } = useAuth();
  
  const hasPermission = (domain: string, action: 'create' | 'read' | 'edit' | 'delete') => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    return checkPermission(domain, action);
  };

  return { hasPermission };
};

export default usePermission;