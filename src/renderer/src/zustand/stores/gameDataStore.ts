import { LoadGameDataComplete } from '@shared/typings/ipc-function/to-renderer/load-game-data.typing';
import { createStore } from 'zustand-x';

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

export const gameDataStore = createStore('gameData')<GameDataState>(
  initialState,
  { devtools: { enabled: true } },
).extendActions((set) => ({
  setGameData: (value: GameDataState) => {
    set.state(() => value);
  },
}));
