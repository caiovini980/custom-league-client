import { ElectronFunction } from '@render/env';

type PromiseFn = (...args: any[]) => Promise<any>;

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
          [key]: (...args: any[]) =>
            fn(...args).catch((err) => {
              throw err;
            }),
        };
      }, {}),
    };
  }, {}) as ElectronFunction;
};
