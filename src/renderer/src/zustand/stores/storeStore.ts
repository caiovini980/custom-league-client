import { store } from '@davstack/store';
import {
  StoreResponse,
  StoreView,
} from '@shared/typings/ipc-function/handle/store.typing';

export interface StoreState {
  data: Partial<Record<StoreView, StoreResponse>>;
  currentTab: StoreView;
}

const initialState: StoreState = {
  data: {},
  currentTab: 'champions',
};

export const storeStore = store(initialState, {
  name: 'store',
  devtools: {
    enabled: true,
  },
}).actions((store) => ({
  resetState: () => store.set(initialState),
}));
