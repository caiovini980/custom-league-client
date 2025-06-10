import { LolMatchHistoryV1Games_Id } from '@shared/typings/lol/response/lolMatchHistoryV1Games_Id';

export interface LolMatchHistoryV1productsLol_Id_Matches {
  accountId: number;
  games: Games;
  platformId: string;
}

interface Games {
  gameBeginDate: string;
  gameCount: number;
  gameEndDate: string;
  gameIndexBegin: number;
  gameIndexEnd: number;
  games: LolMatchHistoryV1Games_Id[];
}
