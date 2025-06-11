import { currentSummonerStore } from '@render/zustand/stores/currentSummonerStore';
import { gameDataStore } from '@render/zustand/stores/gameDataStore';
import { mapValuesKey } from 'zustand-x';
import { leagueClientStore } from './stores/leagueClientStore';
import { lobbyStore } from '@render/zustand/stores/lobbyStore';
import { soundStore } from './stores/sounds';

// Global store
export const rootStore = {
  leagueClient: leagueClientStore,
  currentSummoner: currentSummonerStore,
  gameData: gameDataStore,
  lobby: lobbyStore,
  sound: soundStore,
};

// Global hook selectors
export const useStore = () => mapValuesKey('use', rootStore);

// Global tracked hook selectors
export const useTrackedStore = () => mapValuesKey('useTracked', rootStore);

// Global getter selectors
export const storeValues = mapValuesKey('get', rootStore);

// Global actions
export const storeActions = mapValuesKey('set', rootStore);
