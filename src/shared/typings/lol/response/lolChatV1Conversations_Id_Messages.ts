export interface LolChatV1Conversations_Id_Messages {
  body: 'joined_room' | 'left_room' | string;
  fromId: string;
  fromObfuscatedSummonerId: number;
  fromPid: string;
  fromSummonerId: number;
  id: string;
  isHistorical: boolean;
  timestamp: string;
  type: 'system' | 'chat';
}
