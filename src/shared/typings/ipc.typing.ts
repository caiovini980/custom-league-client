import {
  GetAppConfigResponse,
  SetAppConfigData,
} from '@shared/typings/ipc-function/handle/app-config.typing';
import {
  ClientMakeRequestPayload,
  ClientMakeRequestResponse,
  GetPatchNotesResponse,
} from '@shared/typings/ipc-function/handle/client.typing';
import { VersionInfo } from '@shared/typings/ipc-function/handle/updater.typing';
import { ClientStatusResponse } from '@shared/typings/ipc-function/to-renderer/client-status.typing';
import { LoadGameData } from '@shared/typings/ipc-function/to-renderer/load-game-data.typing';
import {
  ClientEndpointKeys,
  ClientEndpointResponse,
} from '@shared/typings/lol/clientEndpoint';
import { ProgressInfo } from 'electron-updater';
import { EventMessage } from '@shared/typings/lol/eventMessage';

type RVoid = (...arg: never[]) => void;

export interface IpcFunction {
  appConfig: {
    getConfig: () => GetAppConfigResponse;
    setConfig: (data: SetAppConfigData) => void;
  };
  updater: {
    check: () => boolean;
    quitAndInstallUpdate: () => void;
    versionInfo: () => VersionInfo;
  };
  client: {
    priorityApp: () => void;
    changeShowClient: (value: boolean) => void;
    getPatchNotes: () => GetPatchNotesResponse;
    reloadGameData: () => void;
    startLeagueClient: () => void;
    getClientStatus: () => ClientStatusResponse;
    makeRequest: <K extends ClientEndpointKeys>(
      data: ClientMakeRequestPayload<K>,
    ) => ClientMakeRequestResponse<ClientEndpointResponse[K]>;
  };
}

export interface IpcMainToRenderer extends Record<string, RVoid> {
  onDownloadingUpdate: (data: ProgressInfo) => void;
  onUpdateComplete: () => void;
  onCheckingForUpdate: () => void;
  processStatus: (status: 'exited' | 'initialized') => void;
  clientStatus: (status: ClientStatusResponse) => void;
  onChangeAppConfig: (configs: GetAppConfigResponse) => void;
  onLeagueClientEvent: (data: EventMessage) => void;
  onLoadGameData: (data: LoadGameData) => void;
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
    name?: string,
  ) => {
    unsubscribe: () => void;
  };
};
