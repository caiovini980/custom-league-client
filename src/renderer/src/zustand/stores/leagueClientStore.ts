import { createStore } from 'zustand-x';

export interface LeagueClientState {
  isConnected: boolean;
}

const initialState: LeagueClientState = {
  isConnected: false,
};

export const leagueClientStore = createStore('leagueClient')<LeagueClientState>(
  initialState,
  {
    devtools: { enabled: true },
  },
);
