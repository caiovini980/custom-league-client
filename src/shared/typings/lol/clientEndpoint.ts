import { LolGameFlowV1Availability } from '@shared/typings/lol/response/lolGameFlowV1Availability';
import { LolGameflowV1Session } from '@shared/typings/lol/response/lolGameflowV1Session';
import { LolLobbyV2Lobby } from '@shared/typings/lol/response/lolLobbyV2Lobby';
import { LolSummonerV1CurrentSummoner } from '@shared/typings/lol/response/lolSummonerV1CurrentSummoner';
import { PatcherV1ProductsLeagueOfLegendState } from '@shared/typings/lol/response/patcherV1ProductsLeagueOfLegendState';

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
  // Lol Summoner
  '/lol-summoner/v1/current-summoner': EndpointOnlyResponse<LolSummonerV1CurrentSummoner>;
  // Lol Game Flow
  '/lol-gameflow/v1/availability': EndpointOnlyResponse<LolGameFlowV1Availability>;
  '/lol-gameflow/v1/session': EndpointOnlyResponse<LolGameflowV1Session>;
  // Lol Lobby
  '/lol-lobby/v2/lobby': EndpointOnlyResponse<LolLobbyV2Lobby>;
  // Patcher
  '/patcher/v1/products/league_of_legends/state': EndpointOnlyResponse<PatcherV1ProductsLeagueOfLegendState>;
}

export type ClientEndpointKeys = keyof ClientEndpoint;

export type ClientEndpointRequest = {
  [K in ClientEndpointKeys]: ClientEndpoint[K]['request'];
};

export type ClientEndpointResponse = {
  [K in ClientEndpointKeys]: ClientEndpoint[K]['response'];
};
