import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2', // Blue
    },
    background: {
      default: '#f5faff', // White/Blue tint
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
      main: '#1976d2', // Blue
    },
    background: {
      default: '#121212', // Black
      paper: '#1a237e',   // Dark Blue
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