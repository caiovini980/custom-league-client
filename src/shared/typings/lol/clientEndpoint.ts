import { Undefined } from '@shared/typings/generic.typing';
import { LolLobbyV2Lobby as LolLobbyV2LobbyReq } from '@shared/typings/lol/request/lolLobbyV2Lobby';
import { LolReplaysV1Metadata_Id_Download } from '@shared/typings/lol/request/lolReplaysV1Metadata_Id_Download';
import { LolReplaysV1Metadata_Id_Watch } from '@shared/typings/lol/request/lolReplaysV1Metadata_Id_Watch';
import { LolChampionMasteryV1_Id_ChampionMastery } from '@shared/typings/lol/response/lolChampionMasteryV1_Id_ChampionMastery';
import { LolChatV1FriendCounts } from '@shared/typings/lol/response/lolChatV1FriendCounts';
import { LolChatV1FriendGroups } from '@shared/typings/lol/response/lolChatV1FriendGroups';
import { lolChatV1Friends } from '@shared/typings/lol/response/lolChatV1Friends';
import { LolCollectionsV1inventories_Id_backdrop } from '@shared/typings/lol/response/lolCollectionsV1inventories_Id_backdrop';
import { LolGameFlowV1Availability } from '@shared/typings/lol/response/lolGameFlowV1Availability';
import { LolGameQueuesV1Queues } from '@shared/typings/lol/response/lolGameQueuesV1Queues';
import { LolGameflowV1Session } from '@shared/typings/lol/response/lolGameflowV1Session';
import { LolLobbyV2Lobby as LolLobbyV2LobbyRes } from '@shared/typings/lol/response/lolLobbyV2Lobby';
import { LolLobbyV2LobbyMembers } from '@shared/typings/lol/response/lolLobbyV2LobbyMembers';
import { LolMatchHistoryV1productsLol_Id_Matches } from '@shared/typings/lol/response/lolMatchHistoryV1ProductsLol_Id_Matches';
import { LolMatchmakingV1ReadyCheck } from '@shared/typings/lol/response/lolMatchmakingV1ReadyCheck';
import { LolMatchmakingV1Search } from '@shared/typings/lol/response/lolMatchmakingV1Search';
import { LolRankedV1RankedStats_Id } from '@shared/typings/lol/response/lolRankedV1RankedStats_Id';
import { LolReplaysV1Metadata_Id } from '@shared/typings/lol/response/lolReplaysV1Metadata_Id';
import { LolSummonerV1CurrentSummoner } from '@shared/typings/lol/response/lolSummonerV1CurrentSummoner';
import { LolSummonerV1SummonerProfile } from '@shared/typings/lol/response/lolSummonerV1SummonerProfile';
import { LolSummonerV1Summoners_Id } from '@shared/typings/lol/response/lolSummonerV1Summoners_Id';
import { LolVanguardV1Session } from '@shared/typings/lol/response/lolVanguardV1Session';
import { PatcherV1ProductsLeagueOfLegendState } from '@shared/typings/lol/response/patcherV1ProductsLeagueOfLegendState';
import { RiotClientRegionLocale } from '@shared/typings/lol/response/riotClientRegionLocale';
import { RiotMessagingServiceV1State } from '@shared/typings/lol/response/riotMessagingServiceV1State';
import { SystemV1Builds } from '@shared/typings/lol/response/systemV1Builds';

interface EndpointData<Req, Res> {
  request: Req;
  response: Res;
}

type EndpointOnlyRequest<Req> = EndpointData<Req, null>;
type EndpointOnlyResponse<Res> = EndpointData<undefined, Res>;
type EndpointEmpty = EndpointData<undefined, undefined>;

interface ClientEndpoint {
  // Riot Client
  '/riotclient/pre-shutdown/begin': EndpointEmpty;
  '/riotclient/launch-ux': EndpointEmpty;
  '/riotclient/kill-ux': EndpointEmpty;
  '/riotclient/region-locale': EndpointOnlyResponse<RiotClientRegionLocale>;
  // Riot Messaging Service
  '/riot-messaging-service/v1/state': EndpointOnlyResponse<RiotMessagingServiceV1State>;
  // Lol Chat
  '/lol-chat/v1/friends': EndpointOnlyResponse<lolChatV1Friends[]>;
  '/lol-chat/v1/friend-groups': EndpointOnlyResponse<LolChatV1FriendGroups[]>;
  '/lol-chat/v1/friend-groups/{digits}': EndpointOnlyResponse<LolChatV1FriendGroups>;
  '/lol-chat/v1/friend-counts': EndpointOnlyResponse<LolChatV1FriendCounts>;
  // Lol Champion Mastery
  '/lol-champion-mastery/v1/{uuid}/champion-mastery': EndpointOnlyResponse<
    LolChampionMasteryV1_Id_ChampionMastery[]
  >;
  // Lol Collections
  '/lol-collections/v1/inventories/{digits}/backdrop': EndpointOnlyResponse<LolCollectionsV1inventories_Id_backdrop>;
  //Lol Match History
  '/lol-match-history/v1/products/lol/{uuid}/matches': EndpointOnlyResponse<LolMatchHistoryV1productsLol_Id_Matches>;
  // Lol Replay
  '/lol-replays/v1/metadata/{digits}': EndpointOnlyResponse<LolReplaysV1Metadata_Id>;
  '/lol-replays/v1/rofls/{digits}/download': EndpointOnlyRequest<LolReplaysV1Metadata_Id_Download>;
  '/lol-replays/v1/rofls/{digits}/watch': EndpointOnlyRequest<LolReplaysV1Metadata_Id_Watch>;
  // Lol Summoner
  '/lol-summoner/v1/current-summoner': EndpointOnlyResponse<LolSummonerV1CurrentSummoner>;
  '/lol-summoner/v1/summoners/{digits}': EndpointOnlyResponse<LolSummonerV1Summoners_Id>;
  '/lol-summoner/v1/summoner-profile?puuid={uuid}': EndpointOnlyResponse<LolSummonerV1SummonerProfile>;
  // Lol Game Queue
  '/lol-game-queues/v1/queues': EndpointOnlyResponse<LolGameQueuesV1Queues[]>;
  // Lol Game Flow
  '/lol-gameflow/v1/availability': EndpointOnlyResponse<LolGameFlowV1Availability>;
  '/lol-gameflow/v1/session': EndpointOnlyResponse<LolGameflowV1Session>;
  // Lol Lobby
  '/lol-lobby/v2/lobby': EndpointData<LolLobbyV2LobbyReq, LolLobbyV2LobbyRes>;
  '/lol-lobby/v2/lobby/matchmaking/search': EndpointEmpty;
  '/lol-lobby/v2/lobby/members': EndpointOnlyResponse<LolLobbyV2LobbyMembers[]>;
  '/lol-lobby/v2/play-again': EndpointEmpty;
  // Lol Matchmaking
  '/lol-matchmaking/v1/search': EndpointOnlyResponse<LolMatchmakingV1Search>;
  '/lol-matchmaking/v1/ready-check': EndpointOnlyResponse<LolMatchmakingV1ReadyCheck>;
  '/lol-matchmaking/v1/ready-check/accept': EndpointEmpty;
  '/lol-matchmaking/v1/ready-check/decline': EndpointEmpty;
  // Lol Ranked
  '/lol-ranked/v1/ranked-stats/{uuid}': EndpointOnlyResponse<LolRankedV1RankedStats_Id>;
  // Lol Vanguard
  '/lol-vanguard/v1/session': EndpointOnlyResponse<LolVanguardV1Session>;
  // Patcher
  '/patcher/v1/products/league_of_legends/state': EndpointOnlyResponse<PatcherV1ProductsLeagueOfLegendState>;
  // System
  '/system/v1/builds': EndpointOnlyResponse<SystemV1Builds>;
}

export type ClientEndpointKeys = keyof ClientEndpoint;

export type ClientEndpointRequest = {
  [K in ClientEndpointKeys]: Undefined<ClientEndpoint[K]['request']>;
};

export type ClientEndpointResponse = {
  [K in ClientEndpointKeys]: ClientEndpoint[K]['response'];
};
