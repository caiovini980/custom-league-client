import { LolMissionsV1Missions } from '@shared/typings/lol/response/lolMissionsV1Missions';

export interface LolObjectivesV1Objectives_Id {
  gameType: 'tft' | 'lol';
  objectivesCategories: LolObjectivesV1Objectives_IdObjectivesCategory[];
}

export interface LolObjectivesV1Objectives_IdObjectivesCategory {
  categoryName: string;
  categorySectionImage: string;
  categoryType: string;
  endDate: number;
  id: string;
  lolEventHubType: string;
  objectiveCategoryFilter: string;
  objectives: LolObjectivesV1Objectives_IdObjectivesCategoryObject[];
  overrideBackgroundImage: string;
  progressEndDate: number;
  startDate: number;
  tftPassType: string;
}

export interface LolObjectivesV1Objectives_IdObjectivesCategoryObject {
  backgroundImage: string;
  endDate: number;
  id: string;
  isEnabled: boolean;
  isPooledMission: boolean;
  localizedTag: string;
  localizedTitle: string[];
  maxRefresh: number;
  missions: LolMissionsV1Missions[];
  objectivesType: string;
  priority: number;
  refreshInterval: number;
  startDate: number;
  tag: string[];
}
