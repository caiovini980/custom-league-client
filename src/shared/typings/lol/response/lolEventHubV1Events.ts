export interface LolEventHubV1Events {
  eventId: string;
  eventInfo: EventInfo;
}

export interface EventInfo {
  currentTokenBalance: number;
  endDate: string;
  eventIcon: string;
  eventId: string;
  eventName: string;
  eventPassBundles: EventPassBundle[];
  eventTokenImage: string;
  eventType: string;
  isPassPurchased: boolean;
  lockedTokenCount: number;
  navBarIcon: string;
  progressEndDate: string;
  startDate: string;
  timeOfLastUnclaimedReward: number;
  tokenBundles: unknown[];
  unclaimedRewardCount: number;
}

export interface EventPassBundle {
  contentId: string;
  itemId: number;
  offerId: string;
  typeId: string;
}
