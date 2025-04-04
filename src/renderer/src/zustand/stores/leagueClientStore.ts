import { Null } from '@shared/typings/generic.typing';
import { GetAppConfigResponse } from '@shared/typings/ipc-function/handle/app-config.typing';
import { createStore } from 'zustand-x';

export interface LeagueClientState {
  version: string;
  locale: string;
  isConnected: boolean;
  isAvailable: boolean;
  appConfig: Null<GetAppConfigResponse>;
}

const initialState: LeagueClientState = {
  version: '',
  locale: '',
  isConnected: false,
  isAvailable: false,
  appConfig: null,
};

export const leagueClientStore = createStore('leagueClient')<LeagueClientState>(
  initialState,
  {
    devtools: { enabled: true },
  },
).extendActions((set, get) => ({
  resetState: () => {
    const s: LeagueClientState = {
      ...initialState,
      appConfig: get.appConfig(),
    };
    set.state(() => s);
  },
}));
