import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../context/useAuthContext';

type Props = { allowedRoles?: string[]; children: React.ReactNode };

const ProtectedRoute: React.FC<Props> = ({ allowedRoles = [], children }) => {
  const { user } = useAuthContext();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const roleHolder = user as unknown as { role?: string | number };
  const rawRole = roleHolder.role;
  const role = typeof rawRole === 'string' ? rawRole : String(rawRole ?? '');

  if (allowedRoles.length && !allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
