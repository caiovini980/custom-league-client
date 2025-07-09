export interface LolMissionsV1Missions {
  backgroundImageUrl: string;
  celebrationType: 'TOAST' | 'VIGNETTE' | 'VIGNETTE_LARGE_REWARDS_ONLY';
  clientNotifyLevel: 'ALWAYS' | 'NONE';
  completedDate: number;
  completionExpression: '1 or 2' | '1 and 2' | '';
  cooldownTimeMillis: number;
  description: string;
  display: LolMissionsV1MissionsDisplay;
  displayType: string;
  earnedDate: number;
  endTime: number;
  expiringWarnings: unknown[];
  helperText: string;
  iconImageUrl: string;
  id: string;
  internalName: string;
  isNew: boolean;
  lastUpdatedTimestamp: number;
  locale: string;
  media: Partial<LolMissionsV1MissionsMedia>;
  metadata: LolMissionsV1MissionsMetadata;
  missionLineText: string;
  missionType: 'REPEATING' | 'ONETIME' | '';
  objectives: LolMissionsV1MissionsObject[];
  requirements: string[];
  rewardStrategy: LolMissionsV1MissionsRewardStrategy;
  rewards: LolMissionsV1MissionsReward[];
  sequence: number;
  seriesName: string;
  startTime: number;
  status: 'PENDING' | 'COMPLETED' | 'DUMMY';
  title: string;
  viewed: boolean;
}

export type LolMissionsV1MissionsDisplayLocation =
  | 'LOL_SEASONAL'
  | 'LOL_WEEKLY'
  | 'LOL_MASTERY'
  | 'LOL_EVENTS'
  | 'LOL_RANKED'
  | 'LCU_TRACKER'
  | 'HOL_ELITE'
  | 'HOL_WEEKLY'
  | 'HOL_GENERIC'
  | 'FEATURED'
  | 'NPE_REWARDS_LEVEL_UP'
  | 'NPE_REWARDS_DAILY_PLAY'
  | 'TFT_WEEKLY'
  | 'TFT_OBJECTIVES_EVENTS'
  | 'TFT_EVENTS_PENGUS'
  | 'TFT_OBJECTIVES_SET10R';

export interface LolMissionsV1MissionsDisplay {
  attributes: unknown[];
  locations: LolMissionsV1MissionsDisplayLocation[];
}

export interface LolMissionsV1MissionsMedia {
  backgroundUrl: string;
}

export interface LolMissionsV1MissionsMetadata {
  chain: number;
  chainSize: number;
  minRequired: number;
  missionType: string;
  npeRewardPack: LolMissionsV1MissionsMetadataNpeRewardPack;
  objectiveMetadataMap: null;
  order: number;
  tutorial: LolMissionsV1MissionsMetadataTutorial;
  weekNum: number;
  xpReward: number;
}

export interface LolMissionsV1MissionsMetadataNpeRewardPack {
  index: number;
  majorReward: LolMissionsV1MissionsMetadataNpeRewardPackMajorReward;
  minorRewards: unknown[];
  premiumReward: boolean;
  rewardKey: string;
}

export interface LolMissionsV1MissionsMetadataNpeRewardPackMajorReward {
  data: null;
  renderer: string;
}

export interface LolMissionsV1MissionsMetadataTutorial {
  displayRewards: LolMissionsV1MissionsMetadataTutorialDisplayRewards;
  queueId: string;
  stepNumber: number;
  useChosenChampion: boolean;
  useQuickSearchMatchmaking: boolean;
}

export interface LolMissionsV1MissionsMetadataTutorialDisplayRewards {}

export interface LolMissionsV1MissionsObject {
  description: string;
  hasObjectiveBasedReward: boolean;
  progress: LolMissionsV1MissionsObjectProgress;
  requirements: unknown[];
  rewardGroups: unknown[];
  sequence: number;
  status: string;
  type: string;
}

export interface LolMissionsV1MissionsObjectProgress {
  currentProgress: number;
  lastViewedProgress: number;
  totalCount: number;
}

export interface LolMissionsV1MissionsRewardStrategy {
  groupStrategy: string;
  selectMaxGroupCount: number;
  selectMinGroupCount: number;
}

export interface LolMissionsV1MissionsReward {
  description: string;
  iconNeedsFrame: boolean;
  iconUrl: string;
  isObjectiveBasedReward: boolean;
  itemId: string;
  media: LolMissionsV1MissionsRewardMedia;
  quantity: number;
  rewardFulfilled: boolean;
  rewardGroup: string;
  rewardGroupSelected: boolean;
  rewardType: string;
  sequence: number;
  smallIconUrl: string;
  uniqueName: string;
}

export interface LolMissionsV1MissionsRewardMedia {}
