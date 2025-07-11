import {
  IpcFunctionObjectMapper,
  IpcMainToRendererObjectMapper,
} from '@shared/typings/ipc.typing';
import { contextBridge, ipcRenderer } from 'electron';
import { merge } from 'lodash';

export class IpcRendererImpl {
  static init() {
    const ipcFunctionObjectMapper: IpcFunctionObjectMapper = {
      appConfig: {
        getConfig: null,
        setConfig: null,
      },
      updater: {
        check: null,
        quitAndInstallUpdate: null,
      },
      client: {
        priorityApp: null,
        getClientStatus: null,
        startLeagueClient: null,
        makeRequest: null,
        reloadGameData: null,
        changeShowClient: null,
        getPatchNotes: null,
      },
    };
    const ipcFunctionFromMain: IpcMainToRendererObjectMapper = {
      onDownloadingUpdate: null,
      onUpdateComplete: null,
      onCheckingForUpdate: null,
      clientStatus: null,
      onChangeAppConfig: null,
      onLeagueClientEvent: null,
      onLoadGameData: null,
      processStatus: null,
    };

    const ipcRendererInvoke: Record<string, unknown> = {};
    const ipcRendererListen: Record<string, unknown> = {};
    const ipcRendererRemoveListen: Record<string, unknown> = {};

    Object.keys(ipcFunctionObjectMapper)
      .reduce((previousValue, currentValue: keyof IpcFunctionObjectMapper) => {
        const functionNameList = Object.keys(
          ipcFunctionObjectMapper[currentValue],
        );
        functionNameList.forEach((fn) => {
          previousValue.push(`${currentValue}/${fn}`);
        });
        return previousValue;
      }, [] as string[])
      .forEach((key) => {
        const [controller, path] = key.split('/');
        merge(ipcRendererInvoke, {
          [controller]: {
            [path]: async (...args: unknown[]) => {
              const { error, result } = await ipcRenderer.invoke(key, ...args);
              if (error) {
                console.log('ipc-error', error);
                const { name, ...extra } = error;
                const e = new Error(JSON.stringify(extra));
                e.name = name;
                throw e;
              }
              return result;
            },
          },
        });
      });

    Object.keys(ipcFunctionFromMain).forEach((key) => {
      ipcRendererListen[key] = (cb: (...args: unknown[]) => void) => {
        const ipcCb = (_: Electron.IpcRendererEvent, ...args: unknown[]) =>
          cb(...args);
        const tt = ipcRenderer.on(key as string, ipcCb);
        return {
          unsubscribe: () => tt.removeListener(key as string, ipcCb),
        };
      };
    });

    Object.keys(ipcFunctionFromMain).forEach((key) => {
      ipcRendererRemoveListen[key] = (cb: (...args: unknown[]) => void) =>
        ipcRenderer.removeListener(key as string, (_, ...args) => cb(...args));
    });

    contextBridge.exposeInMainWorld('electron', {
      listen: ipcRendererListen,
      handle: ipcRendererInvoke,
    });
  }
}
