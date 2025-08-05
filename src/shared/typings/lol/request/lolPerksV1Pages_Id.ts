export interface LolPerksV1Pages_Id {
  isTemporary?: boolean;
  name: string;
  primaryStyleId: number;
  selectedPerkIds: number[];
  subStyleId: number;
  recommendationChampionId?: number;
  recommendationIndex?: number;
  runeRecommendationId?: string;
  isRecommendationOverride?: boolean;
  order?: number;
}
