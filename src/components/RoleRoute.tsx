import React from 'react';
import { Navigate } from 'react-router';
import { Box, Alert } from '@mui/material';
import { useAuthContext } from '../context/useAuthContext';

interface RoleRouteProps {
  children: React.ReactElement;
  role: string;
}

const RoleRoute: React.FC<RoleRouteProps> = ({ children, role }) => {
  const auth = useAuthContext();

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (auth.user?.role !== role) {
    return (
      <Box sx={{ mt: 8 }}>
        <Alert severity="error">You do not have permission to view this page.</Alert>
      </Box>
    );
  }

  return children;
};

export default RoleRoute;
