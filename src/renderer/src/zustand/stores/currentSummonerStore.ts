import { Null } from '@shared/typings/generic.typing';
import { LolSummonerV1SummonerProfile } from '@shared/typings/lol/response/lolSummonerV1SummonerProfile';
import { LolSummonerV1Summoners_Id } from '@shared/typings/lol/response/lolSummonerV1Summoners_Id';
import { createStore } from 'zustand-x';

export interface CurrentSummonerState {
  info: Null<LolSummonerV1Summoners_Id>;
  profile: Null<LolSummonerV1SummonerProfile>;
}

const initialState: CurrentSummonerState = {
  info: null,
  profile: null,
};

export const currentSummonerStore = createStore(
  'currentSummoner',
)<CurrentSummonerState>(initialState, { devtools: { enabled: true } });
