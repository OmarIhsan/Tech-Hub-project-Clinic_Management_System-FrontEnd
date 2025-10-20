import React from 'react';
import { Navigate } from 'react-router-dom';
import { Box, Alert } from '@mui/material';
import { useAuthContext } from '../context/useAuthContext';
import { useEffect } from 'react';

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
    const UnauthorizedWithRefresh: React.FC<{ path: string }> = ({ path }) => {
      useEffect(() => {
        try {
          const key = `unauth-refresh:${path}`;
          const last = sessionStorage.getItem(key);
          const now = Date.now();
          if (!last || now - Number(last) > 5000) {
            sessionStorage.setItem(key, String(now));
            window.location.reload();
          }
        } catch {
          // ignore
        }
      }, [path]);

      return (
        <Box sx={{ mt: 8 }}>
          <Alert severity="error">You do not have permission to view this page.</Alert>
        </Box>
      );
    };

    return <UnauthorizedWithRefresh path={window.location.pathname} />;
  }

  return children;
};

export default RoleRoute;
