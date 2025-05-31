export interface LolPerksV1Pages {
  autoModifiedSelections: unknown[];
  current: boolean;
  id: number;
  isActive: boolean;
  isDeletable: boolean;
  isEditable: boolean;
  isRecommendationOverride: boolean;
  isTemporary: boolean;
  isValid: boolean;
  lastModified: number;
  name: string;
  order: number;
  pageKeystone: LolPerksV1PagesPageKeystone;
  primaryStyleIconPath: string;
  primaryStyleId: number;
  primaryStyleName: string;
  quickPlayChampionIds: unknown[];
  recommendationChampionId: number;
  recommendationIndex: number;
  runeRecommendationId: string;
  secondaryStyleIconPath: string;
  secondaryStyleName: string;
  selectedPerkIds: number[];
  subStyleId: number;
  tooltipBgPath: string;
  uiPerks: LolPerksV1PagesUiPerk[];
}

export interface LolPerksV1PagesPageKeystone {
  iconPath: string;
  id: number;
  name: string;
  slotType: string;
  styleId: number;
}

export interface LolPerksV1PagesUiPerk {
  iconPath: string;
  id: number;
  name: string;
  slotType: string;
  styleId: number;
}
