
import { BrowserRouter } from 'react-router';
import { Box, AppBar, Toolbar, Typography, IconButton, ThemeProvider } from '@mui/material';
import { LocalHospital as ClinicIcon } from '@mui/icons-material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import LogoutIcon from '@mui/icons-material/Logout';
import { useState, useMemo } from 'react';
import { lightTheme, darkTheme } from './components/theme';
import './App.css'
import AppRouter from './router/Router';
import NavigationIcons from './components/NavigationIcons';
import { useAuthContext } from './context/useAuthContext';
import { useNavigate } from 'react-router-dom';

function AppContent() {
  const { logout, isAuthenticated } = useAuthContext();
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);

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

        <NavigationIcons />
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
