import { Null } from '@shared/typings/generic.typing';

export interface GetAppConfigResponse {
  RIOT_CLIENT_PATH: Null<string>;
}

export type SetAppConfigData<T = GetAppConfigResponse> = {
  [K in keyof T]: { name: K; value: T[K] };
}[keyof T];
