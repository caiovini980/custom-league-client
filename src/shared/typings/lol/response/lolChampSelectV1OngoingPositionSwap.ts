type Position = 'top' | 'jungle' | 'middle' | 'bottom' | 'utility';

export interface LolChampSelectV1OngoingPositionSwap {
  id: number;
  initiatedByLocalPlayer: boolean;
  otherSummonerIndex: number;
  requesterPosition: Position;
  requestorIndex: number;
  responderIndex: number;
  responderPosition: Position;
  state:
    | 'ACCEPTED'
    | 'CANCELLED'
    | 'DECLINED'
    | 'SENT'
    | 'RECEIVED'
    | 'INVALID'
    | 'BUSY'
    | 'AVAILABLE';
  type: 'POSITION';
}
