export interface SummonerIcons {
  id: number;
  contentId: string;
  title: string;
  yearReleased: number;
  isLegacy: boolean;
  imagePath: string;
  descriptions: {
    region: string;
    description: string;
  }[];
  rarities: {
    region: string;
    rarity: number;
  }[];
  disabledRegions: string[];
}
