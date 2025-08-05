export interface LolChampionsV1Inventories_Id_Champions {
  active: boolean;
  alias: string;
  banVoPath: string;
  baseLoadScreenPath: string;
  baseSplashPath: string;
  botEnabled: boolean;
  chooseVoPath: string;
  disabledQueues: unknown[];
  freeToPlay: boolean;
  id: number;
  isVisibleInClient: boolean;
  name: string;
  ownership: LolChampionsV1Inventories_Id_ChampionsOwnership;
  passive: LolChampionsV1Inventories_Id_ChampionsPassive;
  purchased: number;
  rankedPlayEnabled: boolean;
  roles: string[];
  skins?: LolChampionsV1Inventories_Id_ChampionsSkin[];
  spells: LolChampionsV1Inventories_Id_ChampionsSpell[];
  squarePortraitPath: string;
  stingerSfxPath: string;
  tacticalInfo: LolChampionsV1Inventories_Id_ChampionsTacticalInfo;
  title: string;
}

export interface LolChampionsV1Inventories_Id_ChampionsOwnership {
  loyaltyReward: boolean;
  owned: boolean;
  rental: LolChampionsV1Inventories_Id_ChampionsOwnershipRental;
  xboxGPReward: boolean;
}

export interface LolChampionsV1Inventories_Id_ChampionsOwnershipRental {
  endDate: number;
  purchaseDate: number;
  rented: boolean;
  winCountRemaining: number;
}

export interface LolChampionsV1Inventories_Id_ChampionsPassive {
  description: string;
  name: string;
}

export interface LolChampionsV1Inventories_Id_ChampionsSkin {
  championId: number;
  chromaPath?: string;
  chromas?: LolChampionsV1Inventories_Id_ChampionsSkinChroma[];
  collectionSplashVideoPath: unknown;
  disabled: boolean;
  emblems: unknown[];
  featuresText: unknown;
  id: number;
  isBase: boolean;
  lastSelected: boolean;
  loadScreenPath: string;
  name: string;
  ownership: LolChampionsV1Inventories_Id_ChampionsOwnership;
  questSkinInfo: LolChampionsV1Inventories_Id_ChampionsSkinQuestSkinInfo;
  rarityGemPath: string;
  skinAugments: LolChampionsV1Inventories_Id_ChampionsSkinChromaSkinAugments;
  skinType: string;
  splashPath: string;
  splashVideoPath: string;
  stillObtainable: boolean;
  tilePath: string;
  uncenteredSplashPath: string;
}

export interface LolChampionsV1Inventories_Id_ChampionsSkinChroma {
  championId: number;
  chromaPath: string;
  colors: string[];
  disabled: boolean;
  id: number;
  lastSelected: boolean;
  name: string;
  ownership: LolChampionsV1Inventories_Id_ChampionsOwnership;
  skinAugments: LolChampionsV1Inventories_Id_ChampionsSkinChromaSkinAugments;
  stillObtainable: boolean;
}

export interface LolChampionsV1Inventories_Id_ChampionsSkinChromaSkinAugments {
  augments: unknown[];
}

export interface LolChampionsV1Inventories_Id_ChampionsSkinQuestSkinInfo {
  collectionCardPath: string;
  collectionDescription: string;
  descriptionInfo: unknown[];
  name: string;
  productType: unknown;
  splashPath: string;
  tiers: unknown[];
  tilePath: string;
  uncenteredSplashPath: string;
}

export interface LolChampionsV1Inventories_Id_ChampionsSpell {
  description: string;
  name: string;
}

export interface LolChampionsV1Inventories_Id_ChampionsTacticalInfo {
  damageType: string;
  difficulty: number;
  style: number;
}
