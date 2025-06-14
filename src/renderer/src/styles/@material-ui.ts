declare module '@mui/material/styles' {
  interface Palette {
    highlight: string;
    matchHistory: {
      win: string;
      defeat: string;
    };
  }

  interface PaletteOptions {
    highlight: string;
    matchHistory: {
      win: string;
      defeat: string;
    };
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {}
}

export {};
