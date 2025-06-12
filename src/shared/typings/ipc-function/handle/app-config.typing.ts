import { Null } from '@shared/typings/generic.typing';

export interface GetAppConfigResponse {
  RIOT_CLIENT_PATH: Null<string>;
  THEME_MODE: 'DARK' | 'LIGHT';
  VOLUME: number;
}

export type SetAppConfigData<T = GetAppConfigResponse> = {
  [K in keyof T]: { name: K; value: T[K] };
}[keyof T];
