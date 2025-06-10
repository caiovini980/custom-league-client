import { Undefined } from '@shared/typings/generic.typing';
import { LolLobbyV2Lobby as LolLobbyV2LobbyReq } from '@shared/typings/lol/request/lolLobbyV2Lobby';
import { LolLobbyV2LobbyMembersLocalMemberPositionPreferences } from '@shared/typings/lol/request/lolLobbyV2LobbyMembersLocalMemberPositionPreferences';
import { LolReplaysV1Metadata_Id_Download } from '@shared/typings/lol/request/lolReplaysV1Metadata_Id_Download';
import { LolReplaysV1Metadata_Id_Watch } from '@shared/typings/lol/request/lolReplaysV1Metadata_Id_Watch';
import { LolChampionMasteryV1_Id_ChampionMastery } from '@shared/typings/lol/response/lolChampionMasteryV1_Id_ChampionMastery';
import { LolChatV1FriendCounts } from '@shared/typings/lol/response/lolChatV1FriendCounts';
import { LolChatV1FriendGroups } from '@shared/typings/lol/response/lolChatV1FriendGroups';
import { LolChatV1Friends } from '@shared/typings/lol/response/lolChatV1Friends';
import { LolCollectionsV1inventories_Id_backdrop } from '@shared/typings/lol/response/lolCollectionsV1inventories_Id_backdrop';
import { LolGameFlowV1Availability } from '@shared/typings/lol/response/lolGameFlowV1Availability';
import { LolGameQueuesV1Queues } from '@shared/typings/lol/response/lolGameQueuesV1Queues';
import { LolGameflowV1Session } from '@shared/typings/lol/response/lolGameflowV1Session';
import { LolLobbyV2Lobby as LolLobbyV2LobbyRes } from '@shared/typings/lol/response/lolLobbyV2Lobby';
import { LolLobbyV2LobbyMembers } from '@shared/typings/lol/response/lolLobbyV2LobbyMembers';
import { LolLoginV1Session } from '@shared/typings/lol/response/lolLoginV1Session';
import { LolMatchHistoryV1productsLol_Id_Matches } from '@shared/typings/lol/response/lolMatchHistoryV1ProductsLol_Id_Matches';
import { LolMatchmakingV1ReadyCheck } from '@shared/typings/lol/response/lolMatchmakingV1ReadyCheck';
import { LolMatchmakingV1Search } from '@shared/typings/lol/response/lolMatchmakingV1Search';
import { LolRankedV1RankedStats_Id } from '@shared/typings/lol/response/lolRankedV1RankedStats_Id';
import { LolReplaysV1Metadata_Id } from '@shared/typings/lol/response/lolReplaysV1Metadata_Id';
import { LolShutdownV1Notification } from '@shared/typings/lol/response/lolShutdownV1Notification';
import { LolSummonerV1CurrentSummoner } from '@shared/typings/lol/response/lolSummonerV1CurrentSummoner';
import { LolSummonerV1SummonerProfile } from '@shared/typings/lol/response/lolSummonerV1SummonerProfile';
import { LolSummonerV1Summoners_Id } from '@shared/typings/lol/response/lolSummonerV1Summoners_Id';
import { LolVanguardV1Session } from '@shared/typings/lol/response/lolVanguardV1Session';
import { PatcherV1ProductsLeagueOfLegendState } from '@shared/typings/lol/response/patcherV1ProductsLeagueOfLegendState';
import { RiotClientRegionLocale } from '@shared/typings/lol/response/riotClientRegionLocale';
import { RiotMessagingServiceV1State } from '@shared/typings/lol/response/riotMessagingServiceV1State';
import { SystemV1Builds } from '@shared/typings/lol/response/systemV1Builds';
import { LolChampSelectV1AllGridCampions } from '@shared/typings/lol/response/lolChampSelectV1AllGridChampions';
import { LolChampSelectV1Session } from '@shared/typings/lol/response/lolChampSelectV1Session';
import { LolChampSelectV1DisabledChampionIds } from '@shared/typings/lol/response/lolChampSelectV1DisabledChampionIds';
import { LolChampSelectV1BannableChampionIds } from '@shared/typings/lol/response/lolChampSelectV1BannableChampionIds';
import { LolChampSelectV1PickableChampionIds } from '@shared/typings/lol/response/lolChampSelectV1PickableChampionIds';
import { LolChampSelectV1SessionMySelection } from '@shared/typings/lol/request/lolChampSelectV1SessionMySelection';
import { LolRemedyV1RemedyNotifications } from '@shared/typings/lol/response/lolRemedyV1RemedyNotifications';
import { LolHonorV2V1Ballot } from '@shared/typings/lol/response/lolHonorV2V1Ballot';
import { LolHonorV1Honor } from '@shared/typings/lol/request/lolHonorV1Honor';
import { LolLobbyV2LobbyInvitations } from '@shared/typings/lol/request/lolLobbyV2LobbyInvitations';
import { LolLobbyV2ReceivedInvitations } from '@shared/typings/lol/response/lolLobbyV2ReceivedInvitations';
import { LolLobbyV2ReceivedInivitations_Id_Accept } from '@shared/typings/lol/request/lolLobbyV2ReceivedInivitations_Id_Accept';
import { LolLobbyV2ReceivedInivitations_Id_Decline } from '@shared/typings/lol/request/lolLobbyV2ReceivedInivitations_Id_Decline';
import { LolChampSelectV1SkinCarouselSkins } from '@shared/typings/lol/response/lolChampSelectV1SkinCarouselSkins';
import { LolChampSelectV1Summoners_Id } from '@shared/typings/lol/response/lolChampSelectV1Summoners_Id';
import { LolGameFlowV1GameFlowPhase } from '@shared/typings/lol/response/lolGameFlowV1GameFlowPhase';
import { LolChampSelectV1SessionActions_Id } from '@shared/typings/lol/request/lolChampSelectV1SessionActions_Id';
import { LolPerksV1Pages } from '@shared/typings/lol/response/lolPerksV1Pages';
import { LolPerksV1Styles } from '@shared/typings/lol/response/lolPerksV1Styles';
import { LolPerksV1CurrentPage } from '@shared/typings/lol/request/lolPerksV1CurrentPage';
import { LolPerksV1Pages_Id } from '@shared/typings/lol/request/lolPerksV1Pages_Id';
import { LolChampSelectV1OngoingPickOrderSwap } from '@shared/typings/lol/response/lolChampSelectV1OngoingPickOrderSwap';
import { LolChampSelectV1OngoingPositionSwap } from '@shared/typings/lol/response/lolChampSelectV1OngoingPositionSwap';
import { LolHonorV2V1Config } from '@shared/typings/lol/response/lolHonorV2V1Config';
import { LolChampSelectV1OngoingChampionSwap } from '@shared/typings/lol/response/lolChampSelectV1OngoingChampionSwap';
import { LolSpectatorV1SpectateLaunch } from '@shared/typings/lol/request/lolSpectatorV1SpectateLaunch';
import { LolPerksV1RecommendedChampionPositions } from '@shared/typings/lol/response/lolPerksV1RecommendedChampionPositions';
import { LolPerksV1RecommendedPagesChampion_Id_Position_Id_Map_Id } from '@shared/typings/lol/response/lolPerksV1RecommendedPagesChampion_Id_Position_Id_Map_Id';
import { LolChatV1Me } from '@shared/typings/lol/request/lolChatV1Me';
import { LolYourShopV1Offers } from '@shared/typings/lol/response/lolYourShopV1Offers';
import { LolYourShopV1Status } from '@shared/typings/lol/response/lolYourShopV1Status';
import { LolMatchHistoryV1Games_Id } from '@shared/typings/lol/response/lolMatchHistoryV1Games_Id';
import { LolChallengesV1SummaryPlayerDataPlayer_Id } from '@shared/typings/lol/response/lolChallengesV1SummaryPlayerDataPlayer_Id';
import { LolInventoryV1WalletAll } from '@shared/typings/lol/response/lolInventoryV1WalletAll';
import { LolSummonerV1AliasLookup } from '@shared/typings/lol/response/lolSummonerV1AliasLookup';

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
  // Lol Challenges
  '/lol-challenges/v1/summary-player-data/player/{uuid}': EndpointOnlyResponse<LolChallengesV1SummaryPlayerDataPlayer_Id>;
  // Lol Chat
  '/lol-chat/v1/me': EndpointData<LolChatV1Me, LolChatV1Friends>;
  '/lol-chat/v1/friends': EndpointOnlyResponse<LolChatV1Friends[]>;
  '/lol-chat/v1/friends/{id}': EndpointOnlyResponse<LolChatV1Friends>;
  '/lol-chat/v1/friend-groups': EndpointOnlyResponse<LolChatV1FriendGroups[]>;
  '/lol-chat/v1/friend-groups/{digits}': EndpointOnlyResponse<LolChatV1FriendGroups>;
  '/lol-chat/v1/friend-counts': EndpointOnlyResponse<LolChatV1FriendCounts>;
  // Lol Champion Mastery
  '/lol-champion-mastery/v1/{uuid}/champion-mastery': EndpointOnlyResponse<
    LolChampionMasteryV1_Id_ChampionMastery[]
  >;
  // Lol Champion Select
  '/lol-champ-select/v1/summoners/{digits}': EndpointOnlyResponse<LolChampSelectV1Summoners_Id>;
  '/lol-champ-select/v1/all-grid-champions': EndpointOnlyResponse<
    LolChampSelectV1AllGridCampions[]
  >;
  '/lol-champ-select/v1/session': EndpointOnlyResponse<LolChampSelectV1Session>;
  '/lol-champ-select/v1/session/my-selection': EndpointOnlyRequest<
    Partial<LolChampSelectV1SessionMySelection>
  >;
  '/lol-champ-select/v1/skin-carousel-skins': EndpointOnlyResponse<
    LolChampSelectV1SkinCarouselSkins[]
  >;
  '/lol-champ-select/v1/pickable-skin-ids': EndpointEmpty;
  '/lol-champ-select/v1/pickable-champion-ids': EndpointOnlyResponse<LolChampSelectV1PickableChampionIds>;
  '/lol-champ-select/v1/bannable-champion-ids': EndpointOnlyResponse<LolChampSelectV1BannableChampionIds>;
  '/lol-champ-select/v1/disabled-champion-ids': EndpointOnlyResponse<LolChampSelectV1DisabledChampionIds>;
  '/lol-champ-select/v1/timer': EndpointEmpty;
  '/lol-champ-select/v1/session/my-selection/reroll': EndpointEmpty;
  '/lol-champ-select/v1/session/bench/swap/{digits}': EndpointEmpty;
  '/lol-champ-select/v1/session/actions/{digits}/complete': EndpointEmpty;
  '/lol-champ-select/v1/session/actions/{digits}': EndpointOnlyRequest<
    Partial<LolChampSelectV1SessionActions_Id>
  >;
  '/lol-champ-select/v1/ongoing-pick-order-swap': EndpointOnlyResponse<LolChampSelectV1OngoingPickOrderSwap>;
  '/lol-champ-select/v1/session/pick-order-swaps/{digits}/accept': EndpointEmpty;
  '/lol-champ-select/v1/session/pick-order-swaps/{digits}/cancel': EndpointEmpty;
  '/lol-champ-select/v1/session/pick-order-swaps/{digits}/decline': EndpointEmpty;
  '/lol-champ-select/v1/session/pick-order-swaps/{digits}/request': EndpointEmpty;
  '/lol-champ-select/v1/ongoing-position-swap': EndpointOnlyResponse<LolChampSelectV1OngoingPositionSwap>;
  '/lol-champ-select/v1/session/position-swaps/{digits}/accept': EndpointEmpty;
  '/lol-champ-select/v1/session/position-swaps/{digits}/cancel': EndpointEmpty;
  '/lol-champ-select/v1/session/position-swaps/{digits}/decline': EndpointEmpty;
  '/lol-champ-select/v1/session/position-swaps/{digits}/request': EndpointEmpty;
  '/lol-champ-select/v1/ongoing-champion-swap': EndpointOnlyResponse<LolChampSelectV1OngoingChampionSwap>;
  '/lol-champ-select/v1/session/champion-swaps/{digits}/accept': EndpointEmpty;
  '/lol-champ-select/v1/session/champion-swaps/{digits}/cancel': EndpointEmpty;
  '/lol-champ-select/v1/session/champion-swaps/{digits}/decline': EndpointEmpty;
  '/lol-champ-select/v1/session/champion-swaps/{digits}/request': EndpointEmpty;

  '/lol-champ-select-legacy/v1/session': EndpointOnlyResponse<LolChampSelectV1Session>;
  // Lol Collections
  '/lol-collections/v1/inventories/{digits}/backdrop': EndpointOnlyResponse<LolCollectionsV1inventories_Id_backdrop>;
  // Lol End Of Game
  '/lol-end-of-game/v1/state/dismiss-stats': EndpointEmpty;
  // Lol Inventory
  '/lol-inventory/v1/wallet/ALL': EndpointOnlyResponse<LolInventoryV1WalletAll>;
  // Lol Replay
  '/lol-replays/v1/metadata/{digits}': EndpointOnlyResponse<LolReplaysV1Metadata_Id>;
  '/lol-replays/v1/rofls/{digits}/download': EndpointOnlyRequest<LolReplaysV1Metadata_Id_Download>;
  '/lol-replays/v1/rofls/{digits}/watch': EndpointOnlyRequest<LolReplaysV1Metadata_Id_Watch>;
  // Lol Remedy
  '/lol-remedy/v1/remedy-notifications': EndpointOnlyResponse<
    LolRemedyV1RemedyNotifications[]
  >;
  '/lol-remedy/v1/ack-remedy-notification/{uuid}': EndpointEmpty;
  // Lol Summoner
  '/lol-summoner/v1/current-summoner': EndpointOnlyResponse<LolSummonerV1CurrentSummoner>;
  '/lol-summoner/v1/summoners/{digits}': EndpointOnlyResponse<LolSummonerV1Summoners_Id>;
  '/lol-summoner/v1/summoner-profile?puuid={uuid}': EndpointOnlyResponse<LolSummonerV1SummonerProfile>;
  '/lol-summoner/v2/summoners?ids={digits}': EndpointOnlyResponse<
    LolSummonerV1Summoners_Id[]
  >;
  '/lol-summoner/v2/summoners/puuid/{uuid}': EndpointOnlyResponse<LolSummonerV1Summoners_Id>;
  '/lol-summoner/v1/alias/lookup?gameName={string}&tagLine={string}': EndpointOnlyResponse<LolSummonerV1AliasLookup>;
  // Lol Game Queue
  '/lol-game-queues/v1/queues': EndpointOnlyResponse<LolGameQueuesV1Queues[]>;
  // Lol Game Flow
  '/lol-gameflow/v1/availability': EndpointOnlyResponse<LolGameFlowV1Availability>;
  '/lol-gameflow/v1/session': EndpointOnlyResponse<LolGameflowV1Session>;
  '/lol-gameflow/v1/reconnect': EndpointEmpty;
  '/lol-gameflow/v1/gameflow-phase': EndpointOnlyResponse<LolGameFlowV1GameFlowPhase>;
  // Lol Honor
  '/lol-honor-v2/v1/ballot': EndpointOnlyResponse<LolHonorV2V1Ballot>;
  '/lol-honor-v2/v1/config': EndpointOnlyResponse<LolHonorV2V1Config>;
  '/lol-honor/v1/honor': EndpointOnlyRequest<LolHonorV1Honor>;
  // Lol Lobby
  '/lol-lobby/v2/lobby': EndpointData<LolLobbyV2LobbyReq, LolLobbyV2LobbyRes>;
  '/lol-lobby/v2/lobby/matchmaking/search': EndpointEmpty;
  '/lol-lobby/v2/lobby/members': EndpointOnlyResponse<LolLobbyV2LobbyMembers[]>;
  '/lol-lobby/v2/lobby/members/{digits}/grant-invite': EndpointEmpty;
  '/lol-lobby/v2/lobby/members/{digits}/kick': EndpointEmpty;
  '/lol-lobby/v2/lobby/members/{digits}/promote': EndpointEmpty;
  '/lol-lobby/v2/lobby/members/{digits}/revoke-invite': EndpointEmpty;
  '/lol-lobby/v2/lobby/partyType': EndpointOnlyRequest<string>;
  '/lol-lobby/v2/play-again': EndpointEmpty;
  '/lol-lobby/v2/play-again-decline': EndpointEmpty;
  '/lol-lobby/v2/party/{uuid}/join': EndpointEmpty;
  '/lol-lobby/v2/lobby/members/localMember/position-preferences': EndpointOnlyRequest<LolLobbyV2LobbyMembersLocalMemberPositionPreferences>;
  '/lol-lobby/v2/lobby/invitations': EndpointOnlyRequest<
    LolLobbyV2LobbyInvitations[]
  >;
  '/lol-lobby/v2/received-invitations': EndpointOnlyResponse<
    LolLobbyV2ReceivedInvitations[]
  >;
  '/lol-lobby/v2/received-invitations/{invitationId}/accept': EndpointOnlyRequest<LolLobbyV2ReceivedInivitations_Id_Accept>;
  '/lol-lobby/v2/received-invitations/{invitationId}/decline': EndpointOnlyRequest<LolLobbyV2ReceivedInivitations_Id_Decline>;
  // Lol Lobby Team Builder
  '/lol-lobby-team-builder/champ-select/v1/session/quit': EndpointEmpty;
  // Lol Login
  '/lol-login/v1/session': EndpointOnlyResponse<LolLoginV1Session>;
  // Lol Matchmaking
  '/lol-matchmaking/v1/search': EndpointOnlyResponse<LolMatchmakingV1Search>;
  '/lol-matchmaking/v1/ready-check': EndpointOnlyResponse<LolMatchmakingV1ReadyCheck>;
  '/lol-matchmaking/v1/ready-check/accept': EndpointEmpty;
  '/lol-matchmaking/v1/ready-check/decline': EndpointEmpty;
  //Lol Match History
  '/lol-match-history/v1/products/lol/{uuid}/matches?begIndex={digits}&endIndex={digits}': EndpointOnlyResponse<LolMatchHistoryV1productsLol_Id_Matches>;
  '/lol-match-history/v1/games/{digits}': EndpointOnlyResponse<LolMatchHistoryV1Games_Id>;
  // Lol Perks
  '/lol-perks/v1/pages': EndpointData<LolPerksV1Pages_Id, LolPerksV1Pages[]>;
  '/lol-perks/v1/pages/{digits}': EndpointData<
    LolPerksV1Pages_Id,
    LolPerksV1Pages
  >;
  '/lol-perks/v1/currentpage': EndpointData<
    LolPerksV1CurrentPage,
    LolPerksV1Pages
  >;
  '/lol-perks/v1/recommended-champion-positions': EndpointOnlyResponse<LolPerksV1RecommendedChampionPositions>;
  '/lol-perks/v1/recommended-pages/champion/{digits}/position/{string}/map/{digits}': EndpointOnlyResponse<
    LolPerksV1RecommendedPagesChampion_Id_Position_Id_Map_Id[]
  >;
  '/lol-perks/v1/styles': EndpointOnlyResponse<LolPerksV1Styles[]>;
  // Lol Ranked
  '/lol-ranked/v1/ranked-stats/{uuid}': EndpointOnlyResponse<LolRankedV1RankedStats_Id>;
  // Lol Spectator
  '/lol-spectator/v1/spectate/launch': EndpointOnlyRequest<LolSpectatorV1SpectateLaunch>;
  // Lol Shutdown
  '/lol-shutdown/v1/notification': EndpointOnlyResponse<LolShutdownV1Notification>;
  // Lol Vanguard
  '/lol-vanguard/v1/session': EndpointOnlyResponse<LolVanguardV1Session>;
  // Lol Your Shop
  '/lol-yourshop/v1/status': EndpointOnlyResponse<LolYourShopV1Status>;
  '/lol-yourshop/v1/offers': EndpointOnlyResponse<LolYourShopV1Offers[]>;
  '/lol-yourshop/v1/offers/{digits}/reveal': EndpointEmpty;
  '/lol-yourshop/v1/offers/{digits}/purchase': EndpointEmpty;
  // Patcher
  '/patcher/v1/products/league_of_legends/state': EndpointOnlyResponse<PatcherV1ProductsLeagueOfLegendState>;
  // Process Control
  '/process-control/v1/process/quit': EndpointEmpty;
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
