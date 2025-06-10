export interface LolChallengesV1SummaryPlayerDataPlayer_Id {
  apexLadderUpdateTime: number;
  apexLeaderboardPosition: number;
  bannerId: string;
  categoryProgress: LolChallengesV1SummaryPlayerDataPlayer_IdCategoryProgress[];
  crestId: string;
  isApex: boolean;
  overallChallengeLevel: string;
  pointsUntilNextRank: number;
  positionPercentile: number;
  prestigeCrestBorderLevel: number;
  selectedChallengesString: string;
  title: LolChallengesV1SummaryPlayerDataPlayer_IdTitle;
  topChallenges: unknown[];
  totalChallengeScore: number;
}

export interface LolChallengesV1SummaryPlayerDataPlayer_IdCategoryProgress {
  category: string;
  current: number;
  level: string;
  max: number;
  positionPercentile: number;
}

export interface LolChallengesV1SummaryPlayerDataPlayer_IdTitle {
  backgroundImagePath: string;
  challengeTitleData: LolChallengesV1SummaryPlayerDataPlayer_IdChallengeTitleData;
  contentId: string;
  iconPath: string;
  isPermanentTitle: boolean;
  itemId: number;
  name: string;
  purchaseDate: string;
  titleAcquisitionName: string;
  titleAcquisitionType: string;
  titleRequirementDescription: string;
}

export interface LolChallengesV1SummaryPlayerDataPlayer_IdChallengeTitleData {
  challengeDescription: string;
  challengeId: number;
  challengeName: string;
  level: string;
  levelToIconPath: LolChallengesV1SummaryPlayerDataPlayer_IdLevelToIconPath;
}

export interface LolChallengesV1SummaryPlayerDataPlayer_IdLevelToIconPath {
  BRONZE: string;
  CHALLENGER: string;
  DIAMOND: string;
  GOLD: string;
  GRANDMASTER: string;
  IRON: string;
  MASTER: string;
  PLATINUM: string;
  SILVER: string;
}
