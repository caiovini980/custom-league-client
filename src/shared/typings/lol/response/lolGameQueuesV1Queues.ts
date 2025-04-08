export interface LolGameQueuesV1Queues {
  allowablePremadeSizes: number[];
  areFreeChampionsAllowed: boolean;
  assetMutator: string;
  category: string;
  championsRequiredToPlay: number;
  description: string;
  detailedDescription: string;
  gameMode: string;
  gameSelectCategory: string;
  gameSelectModeGroup: string;
  gameSelectPriority: number;
  gameTypeConfig: GameTypeConfig;
  hidePlayerPosition: boolean;
  id: number;
  isCustom: boolean;
  isRanked: boolean;
  isSkillTreeQueue: boolean;
  isTeamBuilderManaged: boolean;
  isVisible: boolean;
  lastToggledOffTime: number;
  lastToggledOnTime: number;
  mapId: number;
  maxDivisionForPremadeSize2: string;
  maxLobbySpectatorCount: number;
  maxTierForPremadeSize2: string;
  maximumParticipantListSize: number;
  minLevel: number;
  minimumParticipantListSize: number;
  name: string;
  numPlayersPerTeam: number;
  numberOfTeamsInLobby: number;
  queueAvailability: 'Available' | 'PlatformDisabled';
  queueRewards: QueueRewards;
  removalFromGameAllowed: boolean;
  removalFromGameDelayMinutes: number;
  shortName: string;
  showPositionSelector: boolean;
  showQuickPlaySlotSelection: boolean;
  spectatorEnabled: boolean;
  type: string;
}

interface GameTypeConfig {
  advancedLearningQuests: boolean;
  allowTrades: boolean;
  banMode: string;
  banTimerDuration: number;
  battleBoost: boolean;
  crossTeamChampionPool: boolean;
  deathMatch: boolean;
  doNotRemove: boolean;
  duplicatePick: boolean;
  exclusivePick: boolean;
  gameModeOverride: unknown;
  id: number;
  learningQuests: boolean;
  mainPickTimerDuration: number;
  maxAllowableBans: number;
  name: string;
  numPlayersPerTeamOverride: unknown;
  onboardCoopBeginner: boolean;
  pickMode: string;
  postPickTimerDuration: number;
  reroll: boolean;
  teamChampionPool: boolean;
}

interface QueueRewards {
  isChampionPointsEnabled: boolean;
  isIpEnabled: boolean;
  isXpEnabled: boolean;
  partySizeIpRewards: unknown[];
}
