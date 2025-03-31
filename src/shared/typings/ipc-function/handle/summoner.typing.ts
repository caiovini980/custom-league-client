import { LolSummonerV1SummonerProfile } from '@shared/typings/lol/response/lolSummonerV1SummonerProfile';
import { LolSummonerV1Summoners_Id } from '@shared/typings/lol/response/lolSummonerV1Summoners_Id';

export interface SummonerGetSummonerByIdResponse {
  info: LolSummonerV1Summoners_Id;
  profile: LolSummonerV1SummonerProfile;
}

export type SummonerGetCurrentSummonerResponse =
  SummonerGetSummonerByIdResponse;
