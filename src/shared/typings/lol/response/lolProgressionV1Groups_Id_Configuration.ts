export interface LolProgressionV1Groups_Id_Configuration {
  counters: LolProgressionV1Groups_Id_ConfigurationCounter[];
  id: string;
  milestones: LolProgressionV1Groups_Id_ConfigurationMilestone[];
  name: string;
  productId: string;
  repeat: LolProgressionV1Groups_Id_ConfigurationRepeat;
}

export interface LolProgressionV1Groups_Id_ConfigurationCounter {
  direction: string;
  groupId: string;
  id: string;
  name: string;
  startValue: number;
}

export interface LolProgressionV1Groups_Id_ConfigurationMilestone {
  counterId: string;
  groupId: string;
  id: string;
  name: string;
  properties: LolProgressionV1Groups_Id_ConfigurationMilestoneProperties;
  triggerValue: number;
}

export interface LolProgressionV1Groups_Id_ConfigurationMilestoneProperties {
  REWARD_GROUP_ID: string;
}

export interface LolProgressionV1Groups_Id_ConfigurationRepeat {
  count: number;
  milestones: unknown[];
  multiplier: number;
  repeatTriggers: unknown[];
  scope: number;
}
