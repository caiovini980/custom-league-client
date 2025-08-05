export interface LolChatV1Conversations {
  id?: string;
  type?: 'chat' | 'chatgroup' | 'customGame' | 'postGame' | 'championSelect';
  mucJwtDto?: MucJwtDto;
  password?: string;
}

interface MucJwtDto {
  channelClaim: string;
  domain: string;
  jwt: string;
  targetRegion: string;
}
