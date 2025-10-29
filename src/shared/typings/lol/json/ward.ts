export interface Ward {
  id: number;
  name: string;
  description: string;
  wardImagePath: string;
  wardShadowImagePath: string;
  contentId: string;
  isLegacy: boolean;
  regionalDescriptions: {
    region: string;
    description: string;
  }[];
  rarities: {
    region: string;
    rarity: number;
  }[];
}
