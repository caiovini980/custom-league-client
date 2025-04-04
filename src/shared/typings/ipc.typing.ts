import {
  GetAppConfigResponse,
  SetAppConfigData,
} from '@shared/typings/ipc-function/handle/app-config.typing';
import {
  ClientMakeRequestPayload,
  ClientMakeRequestResponse,
} from '@shared/typings/ipc-function/handle/client.typing';
import {
  SummonerGetCurrentSummonerResponse,
  SummonerGetSummonerByIdResponse,
} from '@shared/typings/ipc-function/handle/summoner.typing';
import { ClientStatusResponse } from '@shared/typings/ipc-function/to-renderer/client-status.typing';
import { LoadGameData } from '@shared/typings/ipc-function/to-renderer/load-game-data.typing';
import {
  ClientEndpointKeys,
  ClientEndpointResponse,
} from '@shared/typings/lol/clientEndpoint';

type RVoid = (...arg: never[]) => void;

export interface IpcFunction {
  appConfig: {
    getConfig: () => GetAppConfigResponse;
    setConfig: (data: SetAppConfigData) => void;
  };
  client: {
    startLeagueClient: () => void;
    getIsClientConnected: () => boolean;
    makeRequest: <K extends ClientEndpointKeys>(
      data: ClientMakeRequestPayload<K>,
    ) => ClientMakeRequestResponse<ClientEndpointResponse[K]>;
  };
  lobby: {
    createAram: () => void;
  };
  summoner: {
    getCurrentSummoner: () => SummonerGetCurrentSummonerResponse;
    getSummonerById: (summonerId: number) => SummonerGetSummonerByIdResponse;
  };
}

export interface IpcMainToRenderer extends Record<string, RVoid> {
  serverUp: (up: boolean) => void;
  clientStatus: (status: ClientStatusResponse) => void;
  onChangeAppConfig: (configs: GetAppConfigResponse) => void;
  onLeagueClientEvent: (data: unknown) => void;
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
  ) => {
    unsubscribe: () => void;
  };
};
