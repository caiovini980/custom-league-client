import { store } from '@davstack/store';
import { Null } from '@shared/typings/generic.typing';
import { GetPatchNotesResponse } from '@shared/typings/ipc-function/handle/client.typing';
import { LolActivityCenterV1Content_Id } from '@shared/typings/lol/response/lolActivityCenterV1Content_Id';
import { LolStoreV1Catalog_InventoryType } from '@shared/typings/lol/response/lolStoreV1Catalog_InventoryType';

export interface CenterHubState {
  patchNotes: Null<GetPatchNotesResponse>;
  news: Null<LolActivityCenterV1Content_Id>;
  sales: {
    champions: LolStoreV1Catalog_InventoryType[];
    skins: LolStoreV1Catalog_InventoryType[];
  };
}

const initialState: CenterHubState = {
  patchNotes: null,
  news: null,
  sales: {
    champions: [],
    skins: [],
  },
};

export const centerHubStore = store(initialState, {
  name: 'centerHub',
  devtools: { enabled: true },
}).actions((store) => ({
  resetState: () => store.set(initialState),
}));
