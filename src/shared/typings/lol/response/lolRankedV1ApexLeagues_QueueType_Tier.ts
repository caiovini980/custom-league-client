export interface LolRankedV1ApexLeagues_QueueType_Tier {
  divisions: LolRankedV1ApexLeagues_QueueType_TierDivision[];
  nextApexUpdateMillis: number;
  provisionalGameThreshold: number;
  queueType: string;
  requestedRankedEntry: null;
  tier: string;
}

export interface LolRankedV1ApexLeagues_QueueType_TierDivision {
  apexUnlockTimeMillis: number;
  division: string;
  maxLeagueSize: number;
  minLpForApexTier: number;
  standings: LolRankedV1ApexLeagues_QueueType_TierDivisionStanding[];
  tier: string;
  topNumberOfPlayers: number;
}

export interface LolRankedV1ApexLeagues_QueueType_TierDivisionStanding {
  division: string;
  earnedRegaliaRewardIds: unknown[];
  isProvisional: boolean;
  leaguePoints: number;
  losses: number;
  miniseriesResults: unknown[];
  pendingDemotion: boolean;
  pendingPromotion: boolean;
  position: number;
  positionDelta: number;
  previousPosition: number;
  previousSeasonEndDivision: string;
  previousSeasonEndTier: string;
  provisionalGamesRemaining: number;
  puuid: string;
  rankedRegaliaLevel: number;
  summonerId: number;
  summonerName: string;
  tier: string;
  wins: number;
}
