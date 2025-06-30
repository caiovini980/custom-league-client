import { CssBaseline, ThemeProvider } from '@mui/material';
import { GlobalStyles } from '@render/styles/GlobalStyles';
import { theme } from '@render/styles/theme';
import { JSX, PropsWithChildren } from 'react';

export const CustomThemeProvider = ({
  children,
}: PropsWithChildren<Record<never, never>>): JSX.Element => {
  return (
    <ThemeProvider theme={theme} defaultMode={'dark'} noSsr>
      <CssBaseline />
      <GlobalStyles />
      {children}
    </ThemeProvider>
  );
};
