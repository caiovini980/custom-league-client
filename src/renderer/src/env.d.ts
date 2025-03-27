/// <reference types="vite/client" />

import { IpcFunction, IpcRendererCallback } from '@shared/typings/ipc.typing';

export type ElectronFunction = {
  [K in keyof IpcFunction]: {
    [J in keyof IpcFunction[K]]: (
      // @ts-ignore
      ...args: Parameters<IpcFunction[K][J]>
      // @ts-ignore
    ) => Promise<ReturnType<IpcFunction[K][J]>>;
  };
};

declare global {
  interface Window {
    electron: {
      handle: ElectronFunction;
      listen: IpcRendererCallback;
    };
  }
}

interface ImportMetaEnv {
  readonly RENDERER_VITE_API_BASE_URL: string;
  readonly VITE_NODE_ENV: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
