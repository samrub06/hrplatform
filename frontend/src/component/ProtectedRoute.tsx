import { useContext } from "react";
import { Navigate } from "react-router";
import { UseAuthContext } from "../context/AuthContext";

export const ProtectedRoute = ({ children, requiredRole }: { 
  children: React.ReactNode;
  requiredRole?: string;
}) => {
  const { user } = useContext(UseAuthContext);
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/auth/login" />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
};