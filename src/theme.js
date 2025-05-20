import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary:   { main: '#4A90E2' },
    secondary: { main: '#7ED321' },
    background:{ default: '#F5F7FA' },
    text:      { primary: '#333333', secondary: '#555555' },
  },
  typography: {
    fontFamily: `"Roboto", "Arial", sans-serif`,
    h5:         { fontWeight: 600 },
    button:     { textTransform: 'none' },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#F5F7FA',
          margin:          0,
          padding:         0,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow:   '0 4px 12px rgba(0,0,0,0.05)',
        },
      },
    },
  },
});

export default theme;