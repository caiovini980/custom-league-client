import {
  createTheme,
  PaletteOptions,
  responsiveFontSizes,
} from '@mui/material';
import { deepmerge } from '@mui/utils';

const palette: PaletteOptions = {
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
  chatAvailability: {
    chat: '#47a457',
    away: '#ff6464',
    dnd: '#387ad3',
    offline: 'rgb(96,96,96)',
  },
};

export const theme = responsiveFontSizes(
  createTheme({
    cssVariables: {
      colorSchemeSelector: '.theme-%s',
    },
    colorSchemes: {
      light: {
        palette: deepmerge(palette, {}),
      },
      dark: {
        palette: deepmerge(palette, {
          error: {
            main: '#e37272',
          },
        }),
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
            boxShadow: 'var(--mui-shadows-2)',
            color: 'var(--mui-palette-text-primary)',
            background: 'var(--mui-palette-background-paper)',
          },
          arrow: {
            color: 'var(--mui-palette-background-paper)',
          },
        },
      },
    },
  }),
);
