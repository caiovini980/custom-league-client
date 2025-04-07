export interface LolRankedV1RankedStats_Id {
  currentSeasonSplitPoints: number;
  earnedRegaliaRewardIds: unknown[];
  highestCurrentSeasonReachedTierSR: string;
  highestPreviousSeasonEndDivision: string;
  highestPreviousSeasonEndTier: string;
  highestRankedEntry: HighestRankedEntry;
  highestRankedEntrySR: HighestRankedEntrySr;
  previousSeasonSplitPoints: number;
  queueMap: QueueMap;
  queues: Queue[];
  rankedRegaliaLevel: number;
  seasons: Seasons;
  splitsProgress: SplitsProgress;
}

interface HighestRankedEntry {
  division: string;
  highestDivision: string;
  highestTier: string;
  isProvisional: boolean;
  leaguePoints: number;
  losses: number;
  miniSeriesProgress: string;
  previousSeasonEndDivision: string;
  previousSeasonEndTier: string;
  previousSeasonHighestDivision: string;
  previousSeasonHighestTier: string;
  provisionalGameThreshold: number;
  provisionalGamesRemaining: number;
  queueType: string;
  ratedRating: number;
  ratedTier: string;
  tier: string;
  warnings: unknown;
  wins: number;
}

interface HighestRankedEntrySr {
  division: string;
  highestDivision: string;
  highestTier: string;
  isProvisional: boolean;
  leaguePoints: number;
  losses: number;
  miniSeriesProgress: string;
  previousSeasonEndDivision: string;
  previousSeasonEndTier: string;
  previousSeasonHighestDivision: string;
  previousSeasonHighestTier: string;
  provisionalGameThreshold: number;
  provisionalGamesRemaining: number;
  queueType: string;
  ratedRating: number;
  ratedTier: string;
  tier: string;
  warnings: unknown;
  wins: number;
}

interface QueueMap {
  RANKED_FLEX_SR: RankedFlexSr;
  RANKED_SOLO_5x5: RankedSolo5x5;
  RANKED_TFT: RankedTft;
  RANKED_TFT_DOUBLE_UP: RankedTftDoubleUp;
  RANKED_TFT_TURBO: RankedTftTurbo;
}

interface RankedFlexSr {
  division: string;
  highestDivision: string;
  highestTier: string;
  isProvisional: boolean;
  leaguePoints: number;
  losses: number;
  miniSeriesProgress: string;
  previousSeasonEndDivision: string;
  previousSeasonEndTier: string;
  previousSeasonHighestDivision: string;
  previousSeasonHighestTier: string;
  provisionalGameThreshold: number;
  provisionalGamesRemaining: number;
  queueType: string;
  ratedRating: number;
  ratedTier: string;
  tier: string;
  warnings: unknown;
  wins: number;
}

interface RankedSolo5x5 {
  division: string;
  highestDivision: string;
  highestTier: string;
  isProvisional: boolean;
  leaguePoints: number;
  losses: number;
  miniSeriesProgress: string;
  previousSeasonEndDivision: string;
  previousSeasonEndTier: string;
  previousSeasonHighestDivision: string;
  previousSeasonHighestTier: string;
  provisionalGameThreshold: number;
  provisionalGamesRemaining: number;
  queueType: string;
  ratedRating: number;
  ratedTier: string;
  tier: string;
  warnings: unknown;
  wins: number;
}

interface RankedTft {
  division: string;
  highestDivision: string;
  highestTier: string;
  isProvisional: boolean;
  leaguePoints: number;
  losses: number;
  miniSeriesProgress: string;
  previousSeasonEndDivision: string;
  previousSeasonEndTier: string;
  previousSeasonHighestDivision: string;
  previousSeasonHighestTier: string;
  provisionalGameThreshold: number;
  provisionalGamesRemaining: number;
  queueType: string;
  ratedRating: number;
  ratedTier: string;
  tier: string;
  warnings: unknown;
  wins: number;
}

interface RankedTftDoubleUp {
  division: string;
  highestDivision: string;
  highestTier: string;
  isProvisional: boolean;
  leaguePoints: number;
  losses: number;
  miniSeriesProgress: string;
  previousSeasonEndDivision: string;
  previousSeasonEndTier: string;
  previousSeasonHighestDivision: string;
  previousSeasonHighestTier: string;
  provisionalGameThreshold: number;
  provisionalGamesRemaining: number;
  queueType: string;
  ratedRating: number;
  ratedTier: string;
  tier: string;
  warnings: unknown;
  wins: number;
}

interface RankedTftTurbo {
  division: string;
  highestDivision: string;
  highestTier: string;
  isProvisional: boolean;
  leaguePoints: number;
  losses: number;
  miniSeriesProgress: string;
  previousSeasonEndDivision: string;
  previousSeasonEndTier: string;
  previousSeasonHighestDivision: string;
  previousSeasonHighestTier: string;
  provisionalGameThreshold: number;
  provisionalGamesRemaining: number;
  queueType: string;
  ratedRating: number;
  ratedTier: string;
  tier: string;
  warnings: unknown;
  wins: number;
}

interface Queue {
  division: string;
  highestDivision: string;
  highestTier: string;
  isProvisional: boolean;
  leaguePoints: number;
  losses: number;
  miniSeriesProgress: string;
  previousSeasonEndDivision: string;
  previousSeasonEndTier: string;
  previousSeasonHighestDivision: string;
  previousSeasonHighestTier: string;
  provisionalGameThreshold: number;
  provisionalGamesRemaining: number;
  queueType: string;
  ratedRating: number;
  ratedTier: string;
  tier: string;
  warnings: unknown;
  wins: number;
}

interface Seasons {
  RANKED_FLEX_SR: RankedFlexSr2;
  RANKED_SOLO_5x5: RankedSolo5x52;
  RANKED_TFT: RankedTft2;
  RANKED_TFT_DOUBLE_UP: RankedTftDoubleUp2;
  RANKED_TFT_TURBO: RankedTftTurbo2;
}

interface RankedFlexSr2 {
  currentSeasonEnd: number;
  currentSeasonId: number;
  nextSeasonStart: number;
}

interface RankedSolo5x52 {
  currentSeasonEnd: number;
  currentSeasonId: number;
  nextSeasonStart: number;
}

interface RankedTft2 {
  currentSeasonEnd: number;
  currentSeasonId: number;
  nextSeasonStart: number;
}

interface RankedTftDoubleUp2 {
  currentSeasonEnd: number;
  currentSeasonId: number;
  nextSeasonStart: number;
}

interface RankedTftTurbo2 {
  currentSeasonEnd: number;
  currentSeasonId: number;
  nextSeasonStart: number;
}

type SplitsProgress = {};
