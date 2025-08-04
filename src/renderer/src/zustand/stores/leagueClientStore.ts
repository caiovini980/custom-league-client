import { store } from '@davstack/store';

export interface LeagueClientState {
  version: string;
  locale: string;
  language: string;
  isConnected: boolean;
  isAvailable: boolean;
  isStopping: boolean;
  isClientOpen: boolean;
  systemReady: {
    activeCenter: boolean;
    chat: boolean;
    store: boolean;
    objectives: boolean;
    loot: boolean;
    ranked: boolean;
    yourShop: boolean;
    platformConfig: boolean;
  };
}

const initialState: LeagueClientState = {
  version: '',
  locale: '',
  language: '',
  isConnected: false,
  isAvailable: false,
  isClientOpen: true,
  isStopping: false,
  systemReady: {
    platformConfig: false,
    activeCenter: false,
    chat: false,
    loot: false,
    objectives: false,
    store: false,
    ranked: false,
    yourShop: false,
  },
};

export const leagueClientStore = store(initialState, {
  name: 'leagueClient',
  devtools: { enabled: true },
}).actions((store) => ({
  resetState: () => {
    store.set(initialState);
  },
}));
