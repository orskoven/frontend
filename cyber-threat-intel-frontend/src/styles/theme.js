import { createTheme } from '@mui/material/styles';
import { blue, grey, orange, deepOrange, lightBlue } from '@mui/material/colors';

// Function to generate design tokens based on the mode (light/dark)
const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          // Light mode palette inspired by Apple's subtle colors
          primary: { main: blue[700], contrastText: '#FFFFFF' },
          secondary: { main: orange[500], contrastText: '#FFFFFF' },
          background: { default: '#F5F5F7', paper: '#FFFFFF' },
          text: { primary: grey[900], secondary: grey[700] },
          error: { main: '#FF3B30', contrastText: '#FFFFFF' },
          warning: { main: '#FF9500', contrastText: '#FFFFFF' },
          info: { main: blue[500], contrastText: '#FFFFFF' },
          success: { main: '#34C759', contrastText: '#FFFFFF' },
        }
      : {
          // Dark mode palette for enhanced accessibility
          primary: { main: lightBlue[400], contrastText: '#000000' },
          secondary: { main: deepOrange[500], contrastText: '#000000' },
          background: { default: '#121212', paper: '#1E1E1E' },
          text: { primary: '#FFFFFF', secondary: grey[300] },
          error: { main: '#FF453A', contrastText: '#000000' },
          warning: { main: '#FF9F0A', contrastText: '#000000' },
          info: { main: lightBlue[300], contrastText: '#000000' },
          success: { main: '#30D158', contrastText: '#000000' },
        }),
  },
  typography: {
    fontFamily: ['Helvetica Neue', 'Arial', 'sans-serif'].join(','),
    h1: { fontSize: '2.4rem', fontWeight: 700, lineHeight: 1.2, '@media (min-width:600px)': { fontSize: '3rem' } },
    h2: { fontSize: '2rem', fontWeight: 700, lineHeight: 1.3 },
    h3: { fontSize: '1.75rem', fontWeight: 700, lineHeight: 1.4 },
    h4: { fontSize: '1.5rem', fontWeight: 700, lineHeight: 1.5 },
    h5: { fontSize: '1.25rem', fontWeight: 600, lineHeight: 1.6 },
    h6: { fontSize: '1rem', fontWeight: 600, lineHeight: 1.75 },
    body1: { fontSize: '1rem', fontWeight: 400, lineHeight: 1.6 },
    body2: { fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.43 },
    button: { textTransform: 'none', fontWeight: 600, fontSize: '1rem' },
    caption: { fontSize: '0.75rem', fontWeight: 400, lineHeight: 1.66 },
    overline: { fontSize: '0.75rem', fontWeight: 400, lineHeight: 2.66, textTransform: 'uppercase' },
  },
  shape: {
    borderRadius: 12, // Enhanced rounded corners
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 30,
          padding: '12px 24px',
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0px 6px 10px rgba(0, 0, 0, 0.15)',
          },
          '&:active': {
            transform: 'translateY(0)',
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
          },
        },
        containedPrimary: {
          backgroundColor: blue[700],
          '&:hover': { backgroundColor: blue[800] },
        },
        containedSecondary: {
          backgroundColor: orange[500],
          '&:hover': { backgroundColor: orange[600] },
        },
        outlined: {
          borderColor: blue[700],
          color: blue[700],
          '&:hover': {
            borderColor: blue[800],
            backgroundColor: 'rgba(0, 122, 255, 0.04)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          padding: '24px',
          backgroundColor: '#FFFFFF',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)',
          transition: 'box-shadow 0.3s ease',
          '&:hover': {
            boxShadow: '0px 6px 16px rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          margin: '12px 0',
          '& .MuiOutlinedInput-root': {
            borderRadius: 16,
            transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
            '&:hover fieldset': { borderColor: blue[700] },
            '&.Mui-focused fieldset': {
              borderColor: blue[700],
              boxShadow: `0 0 0 2px ${blue[100]}`,
            },
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          color: grey[700],
          transition: 'color 0.3s ease',
          '&.Mui-focused': { color: blue[700] },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          backgroundColor: grey[200],
          fontWeight: 700,
          fontSize: '1rem',
          color: grey[900],
        },
        body: {
          fontSize: '0.95rem',
          color: grey[800],
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: 'transform 0.2s ease, color 0.3s ease',
          '&:hover': {
            transform: 'scale(1.15)',
            color: blue[700],
          },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontSize: '0.875rem',
          borderRadius: 8,
          backgroundColor: grey[800],
          color: '#FFFFFF',
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
        },
        arrow: { color: grey[800] },
      },
    },
    MuiSnackbar: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          padding: '16px',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 20,
          padding: '24px',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          width: 62,
          height: 34,
          padding: 7,
          '& .MuiSwitch-switchBase': {
            margin: 1,
            padding: 0,
            transform: 'translateX(6px)',
            '&.Mui-checked': {
              color: '#fff',
              transform: 'translateX(22px)',
              '& + .MuiSwitch-track': {
                backgroundColor: blue[700],
                opacity: 1,
                border: 0,
              },
            },
          },
          '& .MuiSwitch-thumb': {
            backgroundColor: '#fff',
            width: 32,
            height: 32,
          },
          '& .MuiSwitch-track': {
            borderRadius: 20 / 2,
            backgroundColor: grey[400],
            opacity: 1,
            transition: 'background-color 0.3s ease',
          },
        },
      },
    },
  },
  transitions: {
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
      complex: 375,
      enteringScreen: 225,
      leavingScreen: 195,
    },
    easing: {
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
    },
  },
});

// Create the theme with light mode as default
const theme = createTheme(getDesignTokens('light')); 

export { getDesignTokens, theme };