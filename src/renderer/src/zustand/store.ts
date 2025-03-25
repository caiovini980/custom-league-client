import { mapValuesKey } from 'zustand-x';
import { leagueClientStore } from './stores/leagueClientStore';

// Global store
export const rootStore = {
  leagueClient: leagueClientStore,
};

// Global hook selectors
export const useStore = () => mapValuesKey('use', rootStore);

// Global tracked hook selectors
export const useTrackedStore = () => mapValuesKey('useTracked', rootStore);

// Global getter selectors
export const storeValues = mapValuesKey('get', rootStore);

// Global actions
export const storeActions = mapValuesKey('set', rootStore);
