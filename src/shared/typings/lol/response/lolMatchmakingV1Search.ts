export interface LolMatchmakingV1Search {
  dodgeData: DodgeData;
  errors: Errors[];
  estimatedQueueTime: number;
  isCurrentlyInQueue: boolean;
  lobbyId: string;
  lowPriorityData: LowPriorityData;
  queueId: number;
  readyCheck: ReadyCheck;
  searchState: 'Found' | 'Searching' | 'Error';
  timeInQueue: number;
}

interface DodgeData {
  dodgerId: number;
  state: string;
}

interface LowPriorityData {
  bustedLeaverAccessToken: string;
  penalizedSummonerIds: unknown[];
  penaltyTime: number;
  penaltyTimeRemaining: number;
  reason: string;
}

interface ReadyCheck {
  declinerIds: unknown[];
  dodgeWarning: string;
  playerResponse: string;
  state: 'Invalid' | 'InProgress';
  suppressUx: boolean;
  timer: number;
}

interface Errors {
  id: number;
  errorType: string;
  message: string;
  penalizedSummonerId: number;
  penaltyTimeRemaining: number;
}
