import { store } from '@davstack/store';

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

export const leagueClientStore = store(initialState, {
  name: 'leagueClient',
  devtools: { enabled: true },
}).actions((store) => ({
  resetState: () => {
    store.set(initialState);
  },
}));
