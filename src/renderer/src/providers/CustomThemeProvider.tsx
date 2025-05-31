import { CssBaseline, ThemeProvider } from '@mui/material';
import { GlobalStyles } from '@render/styles/GlobalStyles';
import { useCustomTheme } from '@render/styles/useCustomTheme';
import { JSX, PropsWithChildren } from 'react';

export const CustomThemeProvider = ({
  children,
}: PropsWithChildren<Record<never, never>>): JSX.Element => {
  const theme = useCustomTheme();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles />
      {children}
    </ThemeProvider>
  );
};
