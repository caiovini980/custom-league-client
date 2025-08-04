import { ElectronFunction } from '@render/env';
import { IpcMainToRenderer } from '@shared/typings/ipc.typing';
import { useEffect } from 'react';

type PromiseFn = (...args: unknown[]) => Promise<unknown>;

export const electronHandle = window.electron.handle;
export const electronListen = window.electron.listen;

export const useElectronHandle = () => {
  return Object.entries(electronHandle).reduce((prev, curr) => {
    const [key, value] = curr;
    return {
      // biome-ignore lint/performance/noAccumulatingSpread: <explanation>
      ...prev,
      // @ts-ignore
      [key]: Object.entries(value).reduce((prev, curr) => {
        const [key, fn] = curr as [string, PromiseFn];
        return {
          // biome-ignore lint/performance/noAccumulatingSpread: <explanation>
          ...prev,
          [key]: (...args: unknown[]) =>
            fn(...args).catch((err) => {
              throw JSON.parse(err.message);
            }),
        };
      }, {}),
    };
  }, {}) as ElectronFunction;
};

export const useElectronListen = <K extends keyof IpcMainToRenderer>(
  ev: K,
  cb: (...args: Parameters<IpcMainToRenderer[K]>) => void,
) => {
  useEffect(() => {
    const { unsubscribe } = electronListen[ev](cb, `useElectronListen::${ev}`);

    return () => {
      unsubscribe();
    };
  }, [ev]);
};
