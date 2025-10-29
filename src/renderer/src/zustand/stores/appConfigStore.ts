import { store } from '@davstack/store';
import { GetAppConfigResponse } from '@shared/typings/ipc-function/handle/app-config.typing';

export type AppConfigState = GetAppConfigResponse;

const initialState: AppConfigState = {
  THEME_MODE: 'DARK',
  RIOT_CLIENT_PATH: null,
  VOLUME: 1,
};

export const appConfigStore = store(initialState, {
  name: 'appConfig',
  devtools: { enabled: true },
}).create();
