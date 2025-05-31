export interface LolLobbyV2ReceivedInvitations {
  canAcceptInvitation: boolean;
  fromSummonerId: number;
  fromSummonerName: string;
  gameConfig: {
    gameMode: string;
    inviteGameType: string;
    mapId: number;
    queueId: number;
  };
  invitationId: string;
  invitationType: string;
  restrictions: unknown[];
  state: 'Pending';
  timestamp: string;
}
