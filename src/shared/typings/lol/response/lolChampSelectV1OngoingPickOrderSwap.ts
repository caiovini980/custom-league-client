export interface LolChampSelectV1OngoingPickOrderSwap {
  id: number;
  initiatedByLocalPlayer: boolean;
  otherSummonerIndex: number;
  requestorIndex: number;
  responderIndex: number;
  state:
    | 'ACCEPTED'
    | 'CANCELLED'
    | 'DECLINED'
    | 'SENT'
    | 'RECEIVED'
    | 'INVALID'
    | 'BUSY'
    | 'AVAILABLE';
  type: 'PICK_ORDER';
}
