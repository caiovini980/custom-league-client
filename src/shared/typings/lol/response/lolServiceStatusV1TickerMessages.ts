export interface LolServiceStatusV1TickerMessages {
  heading: string;
  message: string;
  severity: 'info' | 'error';
  createdAt: string;
  updatedAt: string;
}
