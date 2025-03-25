import { ElectronFunction } from '@render/env';
import { useElectronHandle } from '@render/utils/electronFunction.util';

interface FnHelper<T extends keyof ElectronFunction> {
  ipc: ElectronFunction[T];
}

const useMakeIpc = <T extends keyof ElectronFunction, R>(
  controller: T,
  fn: (method: FnHelper<T>) => R,
) => {
  const electronHandle = useElectronHandle();

  return () => {
    return fn({ ipc: electronHandle[controller] });
  };
};

export { useMakeIpc };
