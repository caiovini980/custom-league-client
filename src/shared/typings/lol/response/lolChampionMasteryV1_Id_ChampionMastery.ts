export interface LolChampionMasteryV1_Id_ChampionMastery {
  championId: number;
  championLevel: number;
  championPoints: number;
  championPointsSinceLastLevel: number;
  championPointsUntilNextLevel: number;
  championSeasonMilestone: number;
  highestGrade: string;
  lastPlayTime: number;
  markRequiredForNextLevel: number;
  milestoneGrades: string[];
  nextSeasonMilestone: NextSeasonMilestone;
  puuid: string;
  tokensEarned: number;
}

interface NextSeasonMilestone {
  bonus: boolean;
  requireGradeCounts: RequireGradeCounts;
  rewardConfig: RewardConfig;
  rewardMarks: number;
}

interface RequireGradeCounts {
  'A-': number;
}

interface RewardConfig {
  maximumReward: number;
  rewardValue: string;
}
