export interface LolChampSelectV1SkinCarouselSkins {
  championId: number;
  childSkins: LolChampSelectV1SkinCarouselSkinsChildSkins[];
  chromaPreviewPath: string;
  disabled: boolean;
  emblems: unknown[];
  groupSplash: string;
  id: number;
  isBase: boolean;
  isChampionUnlocked: boolean;
  name: string;
  ownership: LolChampSelectV1SkinCarouselSkinsOwnership;
  productType: unknown;
  rarityGemPath: string;
  skinAugments: LolChampSelectV1SkinCarouselSkinsSkinAugments;
  splashPath: string;
  splashVideoPath: unknown;
  stillObtainable: boolean;
  tilePath: string;
  unlocked: boolean;
}

export interface LolChampSelectV1SkinCarouselSkinsOwnership {
  loyaltyReward: boolean;
  owned: boolean;
  rental: {
    rented: boolean;
  };
  xboxGPReward: boolean;
}

export type LolChampSelectV1SkinCarouselSkinsSkinAugments = {};

export interface LolChampSelectV1SkinCarouselSkinsChildSkins {
  championId: number;
  chromaPreviewPath: null | string;
  colors: string[];
  disabled: boolean;
  id: number;
  isBase: boolean;
  isChampionUnlocked: boolean;
  name: string;
  ownership: LolChampSelectV1SkinCarouselSkinsOwnership;
  parentSkinId: number;
  shortName: string;
  skinAugments: LolChampSelectV1SkinCarouselSkinsSkinAugments;
  splashPath: string;
  splashVideoPath: null | string;
  stage: number;
  stillObtainable: boolean;
  tilePath: string;
  unlocked: boolean;
}
