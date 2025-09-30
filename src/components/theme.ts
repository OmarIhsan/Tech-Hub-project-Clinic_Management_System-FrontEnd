import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    background: {
      default: '#f5faff', 
      paper: '#ffffff',
    },
    text: {
      primary: '#1a237e',
      secondary: '#1976d2',
    },
  },
  typography: {
    fontFamily: 'Dubai, Arial, sans-serif',
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1976d2', 
    },
    background: {
      default: '#121212',
      paper: '#1a237e',   
    },
    text: {
      primary: '#ffffff',
      secondary: '#90caf9',
    },
  },
  typography: {
    fontFamily: 'Dubai, Arial, sans-serif',
  },
});