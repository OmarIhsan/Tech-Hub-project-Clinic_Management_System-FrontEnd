import { BrowserRouter } from 'react-router-dom';
import { Box, AppBar, Toolbar, Typography } from '@mui/material';
import { LocalHospital as ClinicIcon } from '@mui/icons-material';
import './App.css'
import AppRouter from './router/Router';
import NavigationIcons from './components/NavigationIcons';

function App() {
  return (
    <BrowserRouter>
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
          </Toolbar>
        </AppBar>

        <Box 
          component="main" 
          sx={{ 
            flexGrow: 1,
            pb: 8,
            backgroundColor: '#f5f5f5',
            minHeight: 'calc(100vh - 64px)'
          }}
        >
          <AppRouter />
        </Box>

        <NavigationIcons />
      </Box>
    </BrowserRouter>
  );
}

export default App;
