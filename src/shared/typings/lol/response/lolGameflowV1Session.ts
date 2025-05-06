export interface LolGameflowV1Session {
  gameClient: GameClient;
  gameData: GameData;
  gameDodge: GameDodge;
  map: Map;
  phase:
    | 'None'
    | 'Lobby'
    | 'ChampSelect'
    | 'InProgress'
    | 'Reconnect'
    | 'EndOfGame'
    | 'PreEndOfGame'
    | 'Matchmaking';
}

interface GameClient {
  observerServerIp: string;
  observerServerPort: number;
  running: boolean;
  serverIp: string;
  serverPort: number;
  visible: boolean;
}

interface GameData {
  gameId: number;
  gameName: string;
  isCustomGame: boolean;
  password: string;
  playerChampionSelections: unknown[];
  queue: Queue;
  spectatorsAllowed: boolean;
  teamOne: unknown[];
  teamTwo: unknown[];
}

interface Queue {
  allowablePremadeSizes: unknown[];
  areFreeChampionsAllowed: boolean;
  assetMutator: string;
  category: string;
  championsRequiredToPlay: number;
  description: string;
  detailedDescription: string;
  gameMode: string;
  gameTypeConfig: GameTypeConfig;
  id: number;
  isRanked: boolean;
  isTeamBuilderManaged: boolean;
  lastToggledOffTime: number;
  lastToggledOnTime: number;
  mapId: number;
  maximumParticipantListSize: number;
  minLevel: number;
  minimumParticipantListSize: number;
  name: string;
  numPlayersPerTeam: number;
  queueAvailability: string;
  queueRewards: QueueRewards;
  removalFromGameAllowed: boolean;
  removalFromGameDelayMinutes: number;
  shortName: string;
  showPositionSelector: boolean;
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
  id: number;
  learningQuests: boolean;
  mainPickTimerDuration: number;
  maxAllowableBans: number;
  name: string;
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

interface GameDodge {
  dodgeIds: unknown[];
  phase: string;
  state: string;
}

interface Map {
  assets: unknown;
  categorizedContentBundles: unknown;
  description: string;
  gameMode: string;
  gameModeName: string;
  gameModeShortName: string;
  gameMutator: string;
  id: number;
  isRGM: boolean;
  mapStringId: string;
  name: string;
  perPositionDisallowedSummonerSpells: PerPositionDisallowedSummonerSpells;
  perPositionRequiredSummonerSpells: PerPositionRequiredSummonerSpells;
  platformId: string;
  platformName: string;
  properties: unknown;
}

type PerPositionDisallowedSummonerSpells = {};

type PerPositionRequiredSummonerSpells = {};
