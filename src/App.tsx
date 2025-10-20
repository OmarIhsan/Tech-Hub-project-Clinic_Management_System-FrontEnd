import { BrowserRouter } from 'react-router';
import { Box, AppBar, Toolbar, Typography, IconButton, ThemeProvider, BottomNavigation, BottomNavigationAction } from '@mui/material';
import { LocalHospital as ClinicIcon, Home as HomeIcon, People as PeopleIcon, Group as GroupIcon, MonetizationOn as MonetizationOnIcon, ReceiptLong as ReceiptLongIcon } from '@mui/icons-material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import LogoutIcon from '@mui/icons-material/Logout';
import { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { lightTheme, darkTheme } from './components/theme';
import './App.css'
import AppRouter from './router/Router';
import { useAuthContext } from './context/useAuthContext';
import { useNavigate } from 'react-router-dom';

function AppContent() {
  const { logout, isAuthenticated } = useAuthContext();
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const location = useLocation();
  const { isAdmin } = useAuthContext();

  const navItems = useMemo(() => {
    const baseNavItems = [
      { key: 'home', label: 'Home', icon: <HomeIcon />, path: '/' },
      { key: 'doctors', label: 'Doctors', icon: <ClinicIcon />, path: '/doctors' },
      { key: 'patients', label: 'Patients', icon: <PeopleIcon />, path: '/patients' },
    ];

    const ownerNavItems = [
      { key: 'staff', label: 'Staff', icon: <GroupIcon />, path: '/staff' },
      { key: 'income', label: 'Income', icon: <MonetizationOnIcon />, path: '/finance/income' },
      { key: 'expenses', label: 'Expenses', icon: <ReceiptLongIcon />, path: '/finance/expenses' },
    ];

    return isAdmin() ? [...baseNavItems, ...ownerNavItems] : baseNavItems;
  }, [isAdmin]);

  // determine active index based on current location
  const activeIndex = navItems.findIndex((item) => location.pathname === item.path || location.pathname.startsWith(item.path + '/'));
  const [value, setValue] = useState(activeIndex === -1 ? 0 : activeIndex);

  // keep active value in sync when route changes
  useEffect(() => {
    const idx = navItems.findIndex((item) => location.pathname === item.path || location.pathname.startsWith(item.path + '/'));
    setValue(idx === -1 ? 0 : idx);
  }, [location.pathname, navItems]);

  const theme = useMemo(
    () => (isDarkMode ? darkTheme : lightTheme),
    [isDarkMode]
  );

  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
    const item = navItems[newValue];
    if (item) navigate(item.path);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <AppBar position="static" elevation={2}>
          <Toolbar>
            <ClinicIcon sx={{ mr: 2, fontSize: 32 }} />
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                flexGrow: 1,
                fontWeight: 600,
                letterSpacing: 0.5
              }}
            >
              Clinic Management System
            </Typography>
            
            {isAuthenticated && (
              <>
                <IconButton 
                  color="inherit" 
                  onClick={handleThemeToggle}
                  sx={{ mr: 1 }}
                  title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                  {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
                </IconButton>
                
                <IconButton 
                  color="inherit" 
                  onClick={handleLogout}
                  title="Logout"
                >
                  <LogoutIcon />
                </IconButton>
              </>
            )}
          </Toolbar>
        </AppBar>

        <Box 
          component="main" 
          sx={{ 
            flexGrow: 1,
            pb: 8,
            backgroundColor: theme.palette.background.default,
            minHeight: 'calc(100vh - 64px)'
          }}
        >
          <AppRouter />
        </Box>

        {isAuthenticated && (
          <BottomNavigation
            value={value}
            onChange={handleChange}
            showLabels
            sx={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: (theme) => theme.zIndex.appBar,
            }}
          >
            {navItems.map((item) => (
              <BottomNavigationAction key={item.key} label={item.label} icon={item.icon} />
            ))}
          </BottomNavigation>
        )}
      </Box>
    </ThemeProvider>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
