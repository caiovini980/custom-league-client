// @ts-ignore

declare module 'express' {
  export interface Response {
    locals: {
      timeIni: number;
    };
  }
}

export {};
