declare module '@mui/material/styles' {
  interface Palette {
    matchHistory: {
      win: string;
      defeat: string;
    };
  }

  interface PaletteOptions {
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
