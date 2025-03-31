import { Null } from '@shared/typings/generic.typing';
import { SummonerGetCurrentSummonerResponse } from '@shared/typings/ipc-function/handle/summoner.typing';
import { createStore } from 'zustand-x';

export interface CurrentSummonerState {
  data: Null<SummonerGetCurrentSummonerResponse>;
}

const initialState: CurrentSummonerState = {
  data: null,
};

export const currentSummonerStore =
  createStore('currentSummoner')<CurrentSummonerState>(initialState);
