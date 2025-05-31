export interface LolChampSelectV1AllGridCampions {
  disabled: boolean;
  freeToPlay: boolean;
  freeToPlayForQueue: boolean;
  id: number;
  loyaltyReward: boolean;
  masteryLevel: number;
  masteryPoints: number;
  name: string;
  owned: boolean;
  positionsFavorited: string[];
  rented: boolean;
  roles: string[];
  selectionStatus: LolChampSelectV1AllGridCampionsSelectionStatus;
  squarePortraitPath: string;
  xboxGPReward: boolean;
}

export interface LolChampSelectV1AllGridCampionsSelectionStatus {
  banIntented: boolean;
  banIntentedByMe: boolean;
  isBanned: boolean;
  pickIntented: boolean;
  pickIntentedByMe: boolean;
  pickIntentedPosition: string;
  pickedByOtherOrBanned: boolean;
  selectedByMe: boolean;
}
