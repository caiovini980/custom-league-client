import { createStore } from 'zustand-x';

export interface LeagueClientState {
  version: string;
  locale: string;
  isConnected: boolean;
  isAvailable: boolean;
  isClientOpen: boolean;
}

const initialState: LeagueClientState = {
  version: '',
  locale: '',
  isConnected: false,
  isAvailable: false,
  isClientOpen: true,
};

export const leagueClientStore = createStore('leagueClient')<LeagueClientState>(
  initialState,
  {
    devtools: { enabled: true },
  },
).extendActions((set) => ({
  resetState: () => {
    set.state(() => initialState);
  },
}));
