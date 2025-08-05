import { store } from '@davstack/store';
import { Null } from '@shared/typings/generic.typing';
import { LolChampionsV1Inventories_Id_Champions } from '@shared/typings/lol/response/lolChampionsV1Inventories_Id_Champions';
import { LolSummonerV1Summoners_Id } from '@shared/typings/lol/response/lolSummonerV1Summoners_Id';

export interface CurrentSummonerState {
  info: Null<LolSummonerV1Summoners_Id>;
  champions: LolChampionsV1Inventories_Id_Champions[];
}

const initialState: CurrentSummonerState = {
  info: null,
  champions: [],
};

export const currentSummonerStore = store(initialState, {
  name: 'currentSummoner',
  devtools: { enabled: true },
}).actions((store) => ({
  resetState: () => {
    store.set(initialState);
  },
  getChampionAvailable: () => {
    return store.champions.filter((c) => c.active)
  }
}));
