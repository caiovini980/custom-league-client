import { Null } from '@shared/typings/generic.typing';
import { LolSummonerV1CurrentSummoner } from '@shared/typings/lol/response/lolSummonerV1CurrentSummoner';
import { createStore } from 'zustand-x';

export interface CurrentSummonerState {
  data: Null<LolSummonerV1CurrentSummoner>;
  profileBackground: unknown;
}

const initialState: CurrentSummonerState = {
  data: null,
  profileBackground: null,
};

export const currentSummonerStore =
  createStore('currentSummoner')<CurrentSummonerState>(initialState);
