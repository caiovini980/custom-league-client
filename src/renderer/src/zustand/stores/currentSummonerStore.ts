import { store } from '@davstack/store';
import { Null } from '@shared/typings/generic.typing';
import { LolSummonerV1SummonerProfile } from '@shared/typings/lol/response/lolSummonerV1SummonerProfile';
import { LolSummonerV1Summoners_Id } from '@shared/typings/lol/response/lolSummonerV1Summoners_Id';

export interface CurrentSummonerState {
  info: Null<LolSummonerV1Summoners_Id>;
  profile: Null<LolSummonerV1SummonerProfile>;
}

const initialState: CurrentSummonerState = {
  info: null,
  profile: null,
};

export const currentSummonerStore = store(initialState, {
  name: 'currentSummoner',
  devtools: { enabled: true },
}).actions((store) => ({
  resetState: () => {
    store.set(initialState);
  },
}));
