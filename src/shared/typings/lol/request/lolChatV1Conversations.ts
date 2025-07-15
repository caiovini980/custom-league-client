export interface LolChatV1Conversations {
  id?: string;
  type?: 'chat' | 'chatgroup' | 'customGame';
  mucJwtDto?: MucJwtDto;
}

interface MucJwtDto {
  channelClaim: string;
  domain: string;
  jwt: string;
  targetRegion: string;
}
