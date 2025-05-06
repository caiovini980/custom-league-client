export interface LolMatchmakingV1ReadyCheck {
  declinerIds: number[];
  dodgeWarning: 'None';
  playerResponse: 'None' | 'Declined' | 'Accepted';
  state: 'InProgress' | 'PartNotReady';
  suppressUx: boolean;
  timer: number;
}
