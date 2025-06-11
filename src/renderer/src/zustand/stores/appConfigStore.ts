import { createStore } from 'zustand-x';
import { GetAppConfigResponse } from '@shared/typings/ipc-function/handle/app-config.typing';

export type AppConfigState = GetAppConfigResponse;

const initialState: AppConfigState = {
  THEME_MODE: 'DARK',
  RIOT_CLIENT_PATH: null,
  VOLUME: 1,
};

export const appConfigStore = createStore('appConfig')<AppConfigState>(
  initialState,
  { devtools: { enabled: true } },
);
