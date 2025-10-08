import { BrowserRouter } from 'react-router-dom';
import { CssBaseline, Box, AppBar, Toolbar, Typography, ThemeProvider } from '@mui/material';
import { lightTheme } from './components/theme';
import AppRouter from './router/Router';
import NavigationIcon from './components/NavigationIcons';

function App() {
  return (
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />
      <BrowserRouter>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Clinic Management System
              </Typography>
            </Toolbar>
          </AppBar>
          
          <Box sx={{ flexGrow: 1 }}>
            <AppRouter />
          </Box>
          
          <NavigationIcon />
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
