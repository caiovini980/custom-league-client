export interface LolMatchmakingV1ReadyCheck {
  declinerIds: number[];
  dodgeWarning: 'None';
  playerResponse: 'None' | 'Declined';
  state: 'InProgress' | 'PartNotReady';
  suppressUx: boolean;
  timer: number;
}
