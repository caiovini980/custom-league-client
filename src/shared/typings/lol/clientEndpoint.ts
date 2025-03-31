import { LolCollectionsV1inventories_Id_backdrop } from '@shared/typings/lol/response/lolCollectionsV1inventories_Id_backdrop';
import { LolGameFlowV1Availability } from '@shared/typings/lol/response/lolGameFlowV1Availability';
import { LolGameflowV1Session } from '@shared/typings/lol/response/lolGameflowV1Session';
import { LolLobbyV2Lobby } from '@shared/typings/lol/response/lolLobbyV2Lobby';
import { LolSummonerV1CurrentSummoner } from '@shared/typings/lol/response/lolSummonerV1CurrentSummoner';
import { LolSummonerV1SummonerProfile } from '@shared/typings/lol/response/lolSummonerV1SummonerProfile';
import { LolSummonerV1Summoners_Id } from '@shared/typings/lol/response/lolSummonerV1Summoners_Id';
import { PatcherV1ProductsLeagueOfLegendState } from '@shared/typings/lol/response/patcherV1ProductsLeagueOfLegendState';
import { RiotClientRegionLocale } from '@shared/typings/lol/response/riotClientRegionLocale';
import { SystemV1Builds } from '@shared/typings/lol/response/systemV1Builds';

interface EndpointData<Req, Res> {
  request: Req;
  response: Res;
}

//type EndpointOnlyRequest<Req> = EndpointData<Req, null>;
type EndpointOnlyResponse<Res> = EndpointData<undefined, Res>;
type EndpointEmpty = EndpointData<undefined, undefined>;

interface ClientEndpoint {
  // Riot Client
  '/riotclient/pre-shutdown/begin': EndpointEmpty;
  '/riotclient/region-locale': EndpointOnlyResponse<RiotClientRegionLocale>;
  // Lol Collections
  '/lol-collections/v1/inventories/{digits}/backdrop': EndpointOnlyResponse<LolCollectionsV1inventories_Id_backdrop>;
  // Lol Summoner
  '/lol-summoner/v1/current-summoner': EndpointOnlyResponse<LolSummonerV1CurrentSummoner>;
  '/lol-summoner/v1/summoners/{$string}': EndpointOnlyResponse<LolSummonerV1Summoners_Id>;
  '/lol-summoner/v1/summoner-profile': EndpointOnlyResponse<LolSummonerV1SummonerProfile>;
  // Lol Game Flow
  '/lol-gameflow/v1/availability': EndpointOnlyResponse<LolGameFlowV1Availability>;
  '/lol-gameflow/v1/session': EndpointOnlyResponse<LolGameflowV1Session>;
  // Lol Lobby
  '/lol-lobby/v2/lobby': EndpointOnlyResponse<LolLobbyV2Lobby>;
  // Patcher
  '/patcher/v1/products/league_of_legends/state': EndpointOnlyResponse<PatcherV1ProductsLeagueOfLegendState>;
  // System
  '/system/v1/builds': EndpointOnlyResponse<SystemV1Builds>;
}

export type ClientEndpointKeys = keyof ClientEndpoint;

export type ClientEndpointRequest = {
  [K in ClientEndpointKeys]: ClientEndpoint[K]['request'];
};

export type ClientEndpointResponse = {
  [K in ClientEndpointKeys]: ClientEndpoint[K]['response'];
};
