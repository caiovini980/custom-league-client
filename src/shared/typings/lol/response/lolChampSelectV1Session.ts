export interface LolChampSelectV1Session {
  actions: LolChampSelectV1SessionAction[][];
  allowBattleBoost: boolean;
  allowDuplicatePicks: boolean;
  allowLockedEvents: boolean;
  allowRerolling: boolean;
  allowSkinSelection: boolean;
  allowSubsetChampionPicks: boolean;
  bans: LolChampSelectV1SessionBans;
  benchChampions: LolChampSelectV1SessionBenchChampions[];
  benchEnabled: boolean;
  boostableSkinCount: number;
  chatDetails: LolChampSelectV1SessionChatDetails;
  counter: number;
  gameId: number;
  hasSimultaneousBans: boolean;
  hasSimultaneousPicks: boolean;
  id: string;
  isCustomGame: boolean;
  isLegacyChampSelect: boolean;
  isSpectating: boolean;
  localPlayerCellId: number;
  lockedEventIndex: number;
  myTeam: LolChampSelectV1SessionTeam[];
  pickOrderSwaps: unknown[];
  positionSwaps: unknown[];
  rerollsRemaining: number;
  showQuitButton: boolean;
  skipChampionSelect: boolean;
  theirTeam: LolChampSelectV1SessionTeam[];
  timer: LolChampSelectV1SessionTimer;
  trades: LolChampSelectV1SessionTrade[];
}

export interface LolChampSelectV1SessionAction {
  actorCellId: number;
  championId: number;
  completed: boolean;
  duration: number;
  id: number;
  isAllyAction: boolean;
  isInProgress: boolean;
  pickTurn: number;
  type: 'pick' | 'ban' | 'ten_bans_reveal';
}

export interface LolChampSelectV1SessionBans {
  myTeamBans: number[];
  numBans: number;
  theirTeamBans: number[];
}

export interface LolChampSelectV1SessionChatDetails {
  mucJwtDto: MucJwtDto;
  multiUserChatId: string;
  multiUserChatPassword: string;
}

interface MucJwtDto {
  channelClaim: string;
  domain: string;
  jwt: string;
  targetRegion: string;
}

export interface LolChampSelectV1SessionTeam {
  assignedPosition: string;
  cellId: number;
  championId: number;
  championPickIntent: number;
  gameName: string;
  internalName: string;
  isHumanoid: boolean;
  nameVisibilityType: string;
  obfuscatedPuuid: string;
  obfuscatedSummonerId: number;
  pickMode: number;
  pickTurn: number;
  playerAlias: string;
  playerType: string;
  puuid: string;
  selectedSkinId: number;
  spell1Id: number;
  spell2Id: number;
  summonerId: number;
  tagLine: string;
  team: number;
  wardSkinId: number;
}

export interface LolChampSelectV1SessionTimer {
  adjustedTimeLeftInPhase: number;
  internalNowInEpochMs: number;
  isInfinite: boolean;
  phase: 'BAN_PICK' | 'FINALIZATION' | 'PLANNING' | 'GAME_STARTING';
  totalTimeInPhase: number;
}

export interface LolChampSelectV1SessionBenchChampions {
  championId: number;
  isPriority: boolean;
}

export interface LolChampSelectV1SessionTrade {
  cellId: number;
  id: number;
  state: 'AVAILABLE' | 'INVALID';
}
