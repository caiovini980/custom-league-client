import { LoadGameDataChampionDataResponse } from '@shared/typings/ipc-function/handle/game-data.typing';
import { createStore } from 'zustand-x';

export interface ChampionState {
  champions: LoadGameDataChampionDataResponse[];
}

const initialState: ChampionState = {
  champions: [],
};

export const championStore =
  createStore('champion')<ChampionState>(initialState);
