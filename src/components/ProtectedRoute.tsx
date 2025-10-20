import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { StaffRole } from '../types';
import { useAuthContext } from '../context/useAuthContext';

interface ProtectedRouteProps {
  allowedRoles?: string[];
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles = [], children }) => {
  const { user } = useAuthContext();
  if (!user) return <Navigate to="/login" />;

  // If no allowedRoles provided => allow any authenticated user
  if (allowedRoles.length && !allowedRoles.includes(String(user.role))) {
    return <Typography>You do not have permission to view this page.</Typography>;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
