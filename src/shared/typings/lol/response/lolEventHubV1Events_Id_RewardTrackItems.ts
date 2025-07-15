export interface LolEventHubV1Events_Id_RewardTrackItems {
  progressRequired: number;
  rewardOptions: RewardOption[];
  rewardTags: unknown[];
  state: string;
  threshold: string;
}

export interface RewardOption {
  cardSize: string;
  celebrationType: string;
  headerType: 'PREMIUM' | 'FREE';
  overrideFooter: string;
  rewardDescription: string;
  rewardFulfillmentSource: string;
  rewardGroupId: string;
  rewardItemId: string;
  rewardItemType: string;
  rewardName: string;
  selected: boolean;
  splashImagePath: string;
  state: 'Unselected' | 'Locked' | 'Selected';
  thumbIconPath: string;
}
