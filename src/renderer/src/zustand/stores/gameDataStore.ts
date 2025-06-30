import { LoadGameDataComplete } from '@shared/typings/ipc-function/to-renderer/load-game-data.typing';
import { store } from '@davstack/store';

export type GameDataState = {
  loaded: boolean;
} & LoadGameDataComplete['info'];

const initialState: GameDataState = {
  loaded: false,
  champions: [],
  spells: [],
  items: [],
  maps: [],
  queues: [],
  perks: [],
  perkStyles: [],
  translate: {} as GameDataState['translate'],
};

export const gameDataStore = store(initialState, {
  name: 'gameData',
  devtools: { enabled: true },
}).actions((store) => ({
  setGameData: (value: GameDataState) => {
    store.set(value);
  },
}));
