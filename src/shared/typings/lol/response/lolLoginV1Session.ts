export interface LolLoginV1Session {
  accountId: number;
  connected: boolean;
  error: {
    description: string;
    errorCode: string;
    messageId: string;
  };
  idToken: string;
  isInLoginQueue: boolean;
  isNewPlayer: boolean;
  puuid: string;
  state: 'LOGGING_OUT';
  summonerId: number;
  userAuthToken: string;
  username: string;
}
