import { createTheme, responsiveFontSizes } from '@mui/material';
import { useMemo } from 'react';
import { useStore } from '@render/zustand/store';

export const useCustomTheme = () => {
  const themeMode = useStore().appConfig.THEME_MODE();
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
          },
        }),
      ),
    [isDarkMode],
  );
};
