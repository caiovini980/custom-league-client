import { createTheme, responsiveFontSizes } from '@mui/material';
import { useMemo } from 'react';
import { appConfigStore } from '@render/zustand/stores/appConfigStore';

export const useCustomTheme = () => {
  const themeMode = appConfigStore.THEME_MODE.use();
  const isDarkMode = themeMode === 'DARK';

  return useMemo(
    () =>
      responsiveFontSizes(
        createTheme({
          palette: {
            mode: isDarkMode ? 'dark' : 'light',
            primary: {
              main: '#007a94',
            },
            secondary: {
              main: '#95160C',
            },
            error: {
              main: '#e05252',
            },
            highlight: '#e9a61e',
            matchHistory: {
              win: '#2a8179',
              defeat: '#7d2727',
            },
          },
          typography: {
            fontFamily: 'Nunito',
          },
          components: {
            MuiButton: {
              styleOverrides: {
                root: {
                  fontSize: '0.9rem',
                  textTransform: 'unset',
                },
              },
            },
            MuiTab: {
              styleOverrides: {
                root: {
                  textTransform: 'unset',
                },
              },
            },
            MuiTooltip: {
              styleOverrides: {
                tooltip: {
                  background: isDarkMode ? '#212121' : '#fff',
                },
                arrow: {
                  color: isDarkMode ? '#212121' : '#fff',
                },
              },
            },
          },
        }),
      ),
    [isDarkMode],
  );
};
