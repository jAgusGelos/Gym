import { ReactNode } from 'react';
import { Navigate } from '@tanstack/react-router';
import { useAuthStore } from '../stores/authStore';
import { UserRole } from '../types/user.types';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.rol)) {
    return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
};
