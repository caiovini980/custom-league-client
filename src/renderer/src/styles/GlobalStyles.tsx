import { GlobalStyles as GlobalStylesMui, useTheme } from '@mui/material';

export const GlobalStyles = () => {
  const theme = useTheme();

  const scrollbarSize = '8px';

  return (
    <GlobalStylesMui
      styles={{
        '*': {
          boxSizing: 'border-box',
        },
        body: {
          margin: 0,
          height: '100vh',
          webkitFontSmoothing: 'antialiased',
          mozOsxFontSmoothing: 'grayscale',
        },
        '#root': {
          height: 'inherit',
        },
        '*::-webkit-scrollbar': {
          width: scrollbarSize,
        },
        '*::-webkit-scrollbar-thumb': {
          borderRadius: 4,
          backgroundColor: theme.palette.primary.main,
          '&:hover': {
            backgroundColor: theme.palette.primary.light,
          },
        },
        '*::-webkit-scrollbar:horizontal': {
          height: scrollbarSize,
        },
      }}
    />
  );
};
