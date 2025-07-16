export interface ClientStatusDisconnected {
  connected: false;
  info: {
    region: string;
    locale: string;
    version: string;
    language: string;
  };
}

export interface ClientStatusConnected {
  connected: true;
  info: {
    region: string;
    locale: string;
    version: string;
    language: string;
  };
}

export type ClientStatusResponse =
  | ClientStatusConnected
  | ClientStatusDisconnected;
