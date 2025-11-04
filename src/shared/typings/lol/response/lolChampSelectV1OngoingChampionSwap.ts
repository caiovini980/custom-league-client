export interface LolChampSelectV1OngoingChampionSwap {
  id: number;
  initiatedByLocalPlayer: boolean;
  otherSummonerIndex: number;
  requesterChampionId: number;
  requestorIndex: number;
  responderIndex: number;
  requesterChampionName: string;
  responderChampionName: string;
  state:
    | 'ACCEPTED'
    | 'CANCELLED'
    | 'DECLINED'
    | 'SENT'
    | 'RECEIVED'
    | 'INVALID'
    | 'BUSY'
    | 'AVAILABLE';
  type: 'CHAMPION';
}
