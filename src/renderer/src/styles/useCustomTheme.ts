import { createTheme, responsiveFontSizes } from '@mui/material';
import { useMemo } from 'react';
import { useStore } from '@render/zustand/store';

export const useCustomTheme = () => {
  const config = useStore().leagueClient.appConfig();
  const isDarkMode = config?.THEME_MODE === 'DARK';

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
