export interface ClientStatusDisconnected {
  connected: false;
}

export interface ClientStatusConnected {
  connected: true;
  info: {
    region: string;
    locale: string;
    version: string;
  };
}

export type ClientStatusResponse =
  | ClientStatusConnected
  | ClientStatusDisconnected;
