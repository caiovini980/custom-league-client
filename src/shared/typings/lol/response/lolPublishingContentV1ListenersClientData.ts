export interface LolPublishingContentV1ListenersClientData {
  account_id: number;
  app_name: string;
  app_version: string;
  assetUrls: LolPublishingContentV1ListenersClientDataAssetUrls;
  env: string;
  locale: string;
  port: number;
  protocol: string;
  puuid: string;
  summoner_level: number;
  summoner_name: string;
  system_os: string;
  web_region: string;
}

export interface LolPublishingContentV1ListenersClientDataAssetUrls {
  baseUrl: string;
  ipIconUrl: string;
  rpIconUrl: string;
  splashUrl: string;
}
