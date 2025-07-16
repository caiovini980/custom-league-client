export interface LolRewardsV1Grands {
  info: LolRewardsV1GrandsInfo;
  rewardGroup: LolRewardsV1GrandsRewardGroup;
}

export interface LolRewardsV1GrandsInfo {
  dateCreated: string;
  grantElements: LolRewardsV1GrandsInfoGrantElement[];
  granteeId: string;
  grantorDescription: LolRewardsV1GrandsInfoGrantorDescription;
  id: string;
  messageParameters: LolRewardsV1GrandsInfoMessageParameters;
  rewardGroupId: string;
  selectedIds: unknown[];
  status: string;
  viewed: boolean;
}

export interface LolRewardsV1GrandsInfoGrantElement {
  elementId: string;
  fulfillmentSource: string;
  itemId: string;
  itemType: string;
  localizations: LolRewardsV1GrandsInfoGrantElementLocalizations;
  media: LolRewardsV1GrandsInfoGrantElementMedia;
  quantity: number;
  status: string;
}

export interface LolRewardsV1GrandsInfoGrantElementLocalizations {}

export interface LolRewardsV1GrandsInfoGrantElementMedia {}

export interface LolRewardsV1GrandsInfoGrantorDescription {
  appName: string;
  entityId: string;
}

export interface LolRewardsV1GrandsInfoMessageParameters {
  honorStat?: number;
}

export interface LolRewardsV1GrandsRewardGroup {
  active: boolean;
  celebrationType: string;
  childRewardGroupIds: unknown[];
  id: string;
  localizations: Localizations2;
  media: Media2;
  productId: string;
  rewardStrategy: string;
  rewards: Reward[];
  selectionStrategyConfig?: SelectionStrategyConfig;
  types: any[];
}

export interface Localizations2 {
  description: string;
  title: string;
}

export interface Media2 {}

export interface Reward {
  fulfillmentSource: string;
  id: string;
  itemId: string;
  itemType: string;
  localizations: Localizations3;
  media: Media3;
  quantity: number;
}

export interface Localizations3 {
  details: string;
  title: string;
}

export interface Media3 {
  iconUrl: string;
}

export interface SelectionStrategyConfig {
  maxSelectionsAllowed: number;
  minSelectionsAllowed: number;
}
