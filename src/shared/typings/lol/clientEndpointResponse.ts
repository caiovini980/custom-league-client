import { LolGameFlowV1Availability } from '@shared/typings/lol/response/lolGameFlowV1Availability';
import { LolGameflowV1Session } from '@shared/typings/lol/response/lolGameflowV1Session';
import { LolLobbyV2Lobby } from '@shared/typings/lol/response/lolLobbyV2Lobby';
import { PatcherV1ProductsLeagueOfLegendState } from '@shared/typings/lol/response/patcherV1ProductsLeagueOfLegendState';

export interface ClientEndpointResponse {
  '/riotclient/pre-shutdown/begin': null;
  '/lol-gameflow/v1/availability': LolGameFlowV1Availability;
  '/lol-gameflow/v1/session': LolGameflowV1Session;
  '/lol-lobby/v2/lobby': LolLobbyV2Lobby;
  '/patcher/v1/products/league_of_legends/state': PatcherV1ProductsLeagueOfLegendState;
}
