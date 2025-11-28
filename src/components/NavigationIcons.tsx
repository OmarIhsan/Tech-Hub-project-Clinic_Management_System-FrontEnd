import React from 'react';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import EventNoteIcon from '@mui/icons-material/EventNote';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DescriptionIcon from '@mui/icons-material/Description';
import HomeIcon from '@mui/icons-material/Home';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../context/useAuthContext';
import { getAvailableRoutes, UserRole } from '../utils/permissions';

interface RouteMeta {
  path: string;
  label: string;
  icon: React.ReactNode;
}

const ROUTE_ICONS: Record<string, RouteMeta> = {
  '/': { path: '/', label: 'Home', icon: <HomeIcon /> },
  '/dashboard': { path: '/dashboard', label: 'Home', icon: <HomeIcon /> },
  '/patients': { path: '/patients', label: 'Patients', icon: <PeopleIcon /> },
  '/appointments': { path: '/appointments', label: 'Appointments', icon: <EventNoteIcon /> },
  '/doctors': { path: '/doctors', label: 'Doctors', icon: <LocalHospitalIcon /> },
  '/treatment-plans': { path: '/treatment-plans', label: 'Treatments', icon: <AssignmentIcon /> },
  '/clinical-documents': { path: '/clinical-documents', label: 'Documents', icon: <DescriptionIcon /> },
  '/procedures': { path: '/procedures', label: 'Procedures', icon: <MedicalServicesIcon /> },
  '/staff': { path: '/staff', label: 'Staff', icon: <LocalHospitalIcon /> },
  '/finance': { path: '/finance', label: 'Finance', icon: <AttachMoneyIcon /> },
};

const NavigationIcons: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthContext();

  const allowedRoutePaths = React.useMemo(() => {
    const routes = getAvailableRoutes(user?.role as UserRole | undefined);
    return routes.map(r => (r === '/dashboard' ? '/' : r));
  }, [user?.role]);

  const navItems: RouteMeta[] = React.useMemo(() => {
    return allowedRoutePaths
      .filter(p => p in ROUTE_ICONS)
      .map(p => ROUTE_ICONS[p]);
  }, [allowedRoutePaths]);

  const currentIndex = navItems.findIndex(i => location.pathname === i.path || (i.path === '/' && location.pathname === '/dashboard'));
  const [value, setValue] = React.useState(currentIndex >= 0 ? currentIndex : 0);

  React.useEffect(() => {
    const idx = navItems.findIndex(i => location.pathname === i.path || (i.path === '/' && location.pathname === '/dashboard'));
    setValue(idx >= 0 ? idx : 0);
  }, [location.pathname, navItems]);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    const item = navItems[newValue];
    if (item) navigate(item.path);
  };

  if (!user) return null;

  return (
    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000 }} elevation={3}>
      <BottomNavigation value={value} onChange={handleChange} showLabels>
        {navItems.map(item => (
          <BottomNavigationAction key={item.path} label={item.label} icon={item.icon} />
        ))}
      </BottomNavigation>
    </Paper>
  );
};

export default NavigationIcons;