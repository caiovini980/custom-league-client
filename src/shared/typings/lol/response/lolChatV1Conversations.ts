export interface LolChatV1Conversations {
  gameName: string;
  gameTag: string;
  id: string;
  inviterId: string;
  isMuted: boolean;
  lastMessage: LolChatV1ConversationsLastMessage;
  mucJwtDto: LolChatV1ConversationsMucJwtDto;
  name: string;
  password: string;
  pid: string;
  targetRegion: string;
  type: string;
  unreadMessageCount: number;
}

export interface LolChatV1ConversationsLastMessage {
  body: string;
  fromId: string;
  fromObfuscatedSummonerId: number;
  fromPid: string;
  fromSummonerId: number;
  id: string;
  isHistorical: boolean;
  timestamp: string;
  type: string;
}

export interface LolChatV1ConversationsMucJwtDto {
  channelClaim: string;
  domain: string;
  jwt: string;
  targetRegion: string;
}
