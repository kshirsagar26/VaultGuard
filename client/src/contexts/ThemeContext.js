import React, { createContext, useContext, useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProviderWrapper = ({ children }) => {
  const [mode, setMode] = useState(() => {
    const savedMode = localStorage.getItem('themeMode');
    return savedMode || 'light';
  });

  useEffect(() => {
    localStorage.setItem('themeMode', mode);
  }, [mode]);

  const toggleTheme = () => {
    setMode(prevMode => prevMode === 'light' ? 'dark' : 'light');
  };

  const theme = createTheme({
    palette: {
      mode,
      ...(mode === 'light'
        ? {
            // Light mode colors
            primary: {
              main: '#6366f1',
              light: '#8b5cf6',
              dark: '#4f46e5',
            },
            secondary: {
              main: '#10b981',
              light: '#34d399',
              dark: '#059669',
            },
            background: {
              default: '#f8fafc',
              paper: '#ffffff',
            },
            text: {
              primary: '#1e293b',
              secondary: '#64748b',
            },
            divider: '#e2e8f0',
            border: '#e2e8f0',
          }
        : {
            // Dark mode colors - Improved contrast and harmony
            primary: {
              main: '#a78bfa',
              light: '#c4b5fd',
              dark: '#8b5cf6',
            },
            secondary: {
              main: '#34d399',
              light: '#6ee7b7',
              dark: '#10b981',
            },
            background: {
              default: '#0f172a',
              paper: '#1e293b',
            },
            text: {
              primary: '#f8fafc',
              secondary: '#cbd5e1',
            },
            divider: '#475569',
            border: '#475569',
          }),
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h4: {
        fontWeight: 600,
      },
      h6: {
        fontWeight: 600,
      },
      subtitle1: {
        fontWeight: 600,
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            background: mode === 'light' ? '#ffffff' : '#1e293b',
            border: `1px solid ${mode === 'light' ? '#e2e8f0' : '#475569'}`,
            boxShadow: mode === 'light' 
              ? '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
              : '0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px 0 rgba(0, 0, 0, 0.2)',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            background: mode === 'light' ? '#ffffff' : '#1e293b',
            border: `1px solid ${mode === 'light' ? '#e2e8f0' : '#475569'}`,
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            background: mode === 'light' ? '#ffffff' : '#1e293b',
            borderBottom: `1px solid ${mode === 'light' ? '#e2e8f0' : '#475569'}`,
            color: mode === 'light' ? '#1e293b' : '#f8fafc',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: mode === 'light' ? '#e2e8f0' : '#475569',
              },
              '&:hover fieldset': {
                borderColor: mode === 'light' ? '#6366f1' : '#a78bfa',
              },
              '&.Mui-focused fieldset': {
                borderColor: mode === 'light' ? '#6366f1' : '#a78bfa',
              },
            },
          },
        },
      },
      MuiSelect: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: mode === 'light' ? '#e2e8f0' : '#475569',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: mode === 'light' ? '#6366f1' : '#a78bfa',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: mode === 'light' ? '#6366f1' : '#a78bfa',
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 600,
          },
        },
      },
    },
  });

  const value = {
    mode,
    toggleTheme,
    theme,
  };

  return (
    <ThemeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}; 