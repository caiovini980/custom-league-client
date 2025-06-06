export interface LolPerksV1RecommendedPagesChampion_Id_Position_Id_Map_Id {
  isDefaultPosition: boolean;
  isRecommendationOverride: boolean;
  keystone: LolPerksV1RecommendedPagesChampion_Id_Position_Id_Map_IdKeystone;
  perks: LolPerksV1RecommendedPagesChampion_Id_Position_Id_Map_IdPerk[];
  position: string;
  primaryPerkStyleId: number;
  primaryRecommendationAttribute: string;
  recommendationChampionId: number;
  recommendationId: string;
  secondaryPerkStyleId: number;
  secondaryRecommendationAttribute: string;
  summonerSpellIds: number[];
}

export interface LolPerksV1RecommendedPagesChampion_Id_Position_Id_Map_IdKeystone {
  iconPath: string;
  id: number;
  longDesc: string;
  name: string;
  recommendationDescriptor: string;
  shortDesc: string;
  slotType: string;
  styleId: number;
  styleIdName: string;
  tooltip: string;
}

export interface LolPerksV1RecommendedPagesChampion_Id_Position_Id_Map_IdPerk {
  iconPath: string;
  id: number;
  longDesc: string;
  name: string;
  recommendationDescriptor: string;
  shortDesc: string;
  slotType: string;
  styleId: number;
  styleIdName: string;
  tooltip: string;
}
