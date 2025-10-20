import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Typography } from '@mui/material';
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
    const UnauthorizedMessage: React.FC<{ path: string }> = ({ path }) => {
      useEffect(() => {
        try {
          const key = `unauth-refresh:${path}`;
          const last = sessionStorage.getItem(key);
          const now = Date.now();
          if (!last || now - Number(last) > 5000) {
            sessionStorage.setItem(key, String(now));
            window.location.reload();
          }
        } catch (err) {
          console.error('ProtectedRoute refresh helper failed', err);
        }
      }, [path]);

      return (
        <Typography sx={{ mt: 4 }} align="center">
          You do not have permission to view this page.
        </Typography>
      );
    };

    return <UnauthorizedMessage path={location.pathname} />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
