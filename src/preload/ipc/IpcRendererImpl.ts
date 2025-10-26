import { randomUUID } from 'node:crypto';
import {
  IpcFunctionObjectMapper,
  IpcMainToRendererObjectMapper,
} from '@shared/typings/ipc.typing';
import { contextBridge, ipcRenderer, shell } from 'electron';
import { merge } from 'lodash-es';
import { EventMessage } from '../../shared/typings/lol/eventMessage';
import {
  buildRegexFromEvent,
  hasKeyRegex,
} from '../../shared/utils/leagueClientEvent.util';

export class IpcRendererImpl {
  static init() {
    const ipcRendererListenCb = new Map<string, (...args: unknown[]) => void>();

    const ipcFunctionObjectMapper: IpcFunctionObjectMapper = {
      appConfig: {
        getConfig: null,
        setConfig: null,
      },
      updater: {
        check: null,
        quitAndInstallUpdate: null,
        versionInfo: null,
      },
      client: {
        blink: null,
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

    Object.keys(ipcFunctionFromMain).forEach((channel) => {
      ipcRendererListen[channel] = (
        cb: (...args: unknown[]) => void,
        name?: string,
      ) => {
        if (cb.name) {
          name = cb.name;
        }
        const id = `${channel}::${randomUUID()}`;
        Object.defineProperty(cb, 'name', {
          value: name ? `${channel}::${name}` : id,
        });

        ipcRendererListenCb.set(id, cb);

        return {
          unsubscribe: () => {
            ipcRendererListenCb.delete(id);
          },
        };
      };

      ipcRenderer.on(
        channel as string,
        (_: Electron.IpcRendererEvent, ...args: unknown[]) => {
          ipcRendererListenCb.forEach((fn, key) => {
            if (!key.includes(channel)) return;
            try {
              if (channel === 'onLeagueClientEvent') {
                const eventName = fn.name.replace(`${channel}::`, '');
                const data = args[0] as EventMessage;
                if (
                  (hasKeyRegex(eventName) &&
                    buildRegexFromEvent(eventName).test(data.uri)) ||
                  data.uri === eventName
                ) {
                  console.log(data.uri, data.data);
                  fn(data);
                }
              } else {
                fn(...args);
              }
            } catch (e) {
              console.log(key, fn.name, args);
              console.error(e);
            }
          });
        },
      );
    });

    contextBridge.exposeInMainWorld('electron', {
      listen: ipcRendererListen,
      handle: ipcRendererInvoke,
      openExternal: (url: string) => {
        shell.openExternal(url).catch((e) => console.error(e));
      },
    });
  }
}
