import { LoadGameDataComplete } from '@shared/typings/ipc-function/to-renderer/load-game-data.typing';
import { createStore } from 'zustand-x';

export type GameDataState = LoadGameDataComplete['info'];

const initialState: GameDataState = {
  champions: [],
  spells: [],
  items: [],
  maps: [],
  queues: [],
  translate: {} as GameDataState['translate'],
};

export const gameDataStore = createStore('gameData')<GameDataState>(
  initialState,
).extendActions((set) => ({
  setGameData: (value: GameDataState) => {
    set.state(() => value);
  },
}));
