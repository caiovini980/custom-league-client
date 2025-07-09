export interface LolChatV1Session {
  sessionExpire: number;
  sessionState: 'loaded' | 'disconnected' | 'initializing';
}
