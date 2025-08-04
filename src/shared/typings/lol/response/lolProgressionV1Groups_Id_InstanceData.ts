export interface LolProgressionV1Groups_Id_InstanceData {
  counters: LolProgressionV1Groups_Id_InstanceDataCounter[];
  groupId: string;
  milestones: LolProgressionV1Groups_Id_InstanceDataMilestone[];
}

export interface LolProgressionV1Groups_Id_InstanceDataCounter {
  counterId: string;
  counterValue: number;
  groupId: string;
  ownerId: string;
  productId: string;
}

export interface LolProgressionV1Groups_Id_InstanceDataMilestone {
  counterId: string;
  groupId: string;
  instanceId: string;
  milestoneId: string;
  ownerId: string;
  productId: string;
  repeatSequence: number;
  triggerValue: number;
  triggered: boolean;
  triggeredTimestamp: string;
  triggers: any[];
}
