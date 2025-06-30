import type {} from '@mui/material/themeCssVarsAugmentation';

declare module '@mui/material/styles' {
  interface Palette {
    highlight: string;
    matchHistory: {
      win: string;
      defeat: string;
    };
    chatAvailability: {
      chat: string;
      away: string;
      dnd: string;
      offline: string;
    };
  }

  interface PaletteOptions {
    highlight: string;
    matchHistory: {
      win: string;
      defeat: string;
    };
    chatAvailability: {
      chat: string;
      away: string;
      dnd: string;
      offline: string;
    };
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    chatAvailability: {
      chat: string;
      away: string;
      dnd: string;
    };
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsColorOverrides {}
}
