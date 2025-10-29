import { store } from '@davstack/store';
import { Null } from '@shared/typings/generic.typing';
import { LolActivityCenterV1Content_IdHeaderLink } from '@shared/typings/lol/response/lolActivityCenterV1Content_Id';

export interface MinigameState {
  open: boolean;
  showButtonInTabId: string;
  data: Null<LolActivityCenterV1Content_IdHeaderLink>;
}

const initialState: MinigameState = {
  open: false,
  showButtonInTabId: '',
  data: null,
};

export const minigameStore = store(initialState, {
  name: 'minigame',
  devtools: { enabled: true },
})
  .actions((store) => ({
    resetState: () => store.set(initialState),
  }))
  .create();
