import { Null } from '@shared/typings/generic.typing';

export interface LolLobbyV2Lobby {
  canStartActivity: boolean;
  gameConfig: GameConfig;
  invitations: Invitation[];
  localMember: LocalMember;
  members: Member[];
  mucJwtDto: MucJwtDto;
  multiUserChatId: string;
  multiUserChatPassword: string;
  partyId: string;
  partyType: 'open' | 'closed';
  popularChampions: unknown[];
  restrictions: Null<Restriction[]>;
  scarcePositions: unknown[];
  warnings: unknown[];
}

interface GameConfig {
  allowablePremadeSizes: number[];
  customLobbyName: string;
  customMutatorName: string;
  customRewardsDisabledReasons: unknown[];
  customSpectatorPolicy: string;
  customSpectators: unknown[];
  customTeam100: unknown[];
  customTeam200: unknown[];
  gameMode: string;
  isCustom: boolean;
  isLobbyFull: boolean;
  isTeamBuilderManaged: boolean;
  mapId: number;
  maxHumanPlayers: number;
  maxLobbySize: number;
  maxTeamSize: number;
  pickType: string;
  premadeSizeAllowed: boolean;
  queueId: number;
  shouldForceScarcePositionSelection: boolean;
  showPositionSelector: boolean;
  showQuickPlaySlotSelection: boolean;
}

interface Invitation {
  invitationId: string;
  invitationType: string;
  state: string;
  timestamp: string;
  toSummonerId: number;
  toSummonerName: string;
}

interface LocalMember {
  allowedChangeActivity: boolean;
  allowedInviteOthers: boolean;
  allowedKickOthers: boolean;
  allowedStartActivity: boolean;
  allowedToggleInvite: boolean;
  autoFillEligible: boolean;
  autoFillProtectedForPromos: boolean;
  autoFillProtectedForRemedy: boolean;
  autoFillProtectedForSoloing: boolean;
  autoFillProtectedForStreaking: boolean;
  botChampionId: number;
  botDifficulty: string;
  botId: string;
  botPosition: string;
  botUuid: string;
  firstPositionPreference: string;
  intraSubteamPosition: unknown;
  isBot: boolean;
  isLeader: boolean;
  isSpectator: boolean;
  memberData: unknown;
  playerSlots: unknown[];
  puuid: string;
  ready: boolean;
  secondPositionPreference: string;
  showGhostedBanner: boolean;
  strawberryMapId: unknown;
  subteamIndex: unknown;
  summonerIconId: number;
  summonerId: number;
  summonerInternalName: string;
  summonerLevel: number;
  summonerName: string;
  teamId: number;
}

interface Member {
  allowedChangeActivity: boolean;
  allowedInviteOthers: boolean;
  allowedKickOthers: boolean;
  allowedStartActivity: boolean;
  allowedToggleInvite: boolean;
  autoFillEligible: boolean;
  autoFillProtectedForPromos: boolean;
  autoFillProtectedForRemedy: boolean;
  autoFillProtectedForSoloing: boolean;
  autoFillProtectedForStreaking: boolean;
  botChampionId: number;
  botDifficulty: string;
  botId: string;
  botPosition: string;
  botUuid: string;
  firstPositionPreference: string;
  intraSubteamPosition: unknown;
  isBot: boolean;
  isLeader: boolean;
  isSpectator: boolean;
  memberData: unknown;
  playerSlots: unknown[];
  puuid: string;
  ready: boolean;
  secondPositionPreference: string;
  showGhostedBanner: boolean;
  strawberryMapId: unknown;
  subteamIndex: unknown;
  summonerIconId: number;
  summonerId: number;
  summonerInternalName: string;
  summonerLevel: number;
  summonerName: string;
  teamId: number;
}

interface MucJwtDto {
  channelClaim: string;
  domain: string;
  jwt: string;
  targetRegion: string;
}

interface Restriction {
  expiredTimestamp: number;
  restrictionArgs: {};
  restrictionCode: string;
  summonerIds: number[];
  summonerIdsString: string;
}
