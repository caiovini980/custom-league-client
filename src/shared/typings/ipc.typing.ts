type RVoid = (...arg: never[]) => void;

export interface IpcFunction {
  server: {
    sendInfo: (status: string) => void;
  };
}

export interface IpcMainToRenderer extends Record<string, RVoid> {
  serverUp: (up: boolean) => void;
}

export type IpcFunctionParameters = {
  [K in keyof IpcFunction]: {
    // @ts-ignore
    [J in keyof IpcFunction[K]]: Parameters<IpcFunction[K][J]>[0];
  };
};

export type IpcFunctionReturnType = {
  [K in keyof IpcFunction]: {
    // @ts-ignore
    [J in keyof IpcFunction[K]]: ReturnType<IpcFunction[K][J]>;
  };
};

export type IpcFunctionObjectMapper = {
  [K in keyof IpcFunction]: {
    [J in keyof IpcFunction[K]]: null;
  };
};

export type IpcMainToRendererObjectMapper = {
  [K in keyof IpcMainToRenderer]: null;
};

export type IpcRendererCallback = {
  [key in keyof IpcMainToRenderer]: (
    cb: (...args: Parameters<IpcMainToRenderer[key]>) => void,
  ) => {
    unsubscribe: () => void;
  };
};
