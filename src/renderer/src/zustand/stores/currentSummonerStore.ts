import { store } from '@davstack/store';
import { gameDataStore } from '@render/zustand/stores/gameDataStore';
import { Null } from '@shared/typings/generic.typing';
import { LolChampionsV1Inventories_Id_Champions } from '@shared/typings/lol/response/lolChampionsV1Inventories_Id_Champions';
import {
  InventoryType,
  LolInventoryV2Inventory_Id,
} from '@shared/typings/lol/response/lolInventoryV2Inventory_Id';
import { LolSummonerV1Summoners_Id } from '@shared/typings/lol/response/lolSummonerV1Summoners_Id';

export interface InventoryOwnedData {
  id: number;
  name: string;
  description: string;
  img: string;
  purchaseDate: string;
}

export interface CurrentSummonerState {
  info: Null<LolSummonerV1Summoners_Id>;
  champions: LolChampionsV1Inventories_Id_Champions[];
  inventory: Record<InventoryType, LolInventoryV2Inventory_Id[]>;
  icons: InventoryOwnedData[];
}

const initialState: CurrentSummonerState = {
  info: null,
  champions: [],
  icons: [],
  inventory: {
    ACHIEVEMENT_TITLE: [],
    CHAMPION: [],
    CHAMPION_SKIN: [],
    COMPANION: [],
    EMOTE: [],
    NEXUS_FINISHER: [],
    REGALIA_BANNER: [],
    SKIN_BORDER: [],
    SUMMONER_ICON: [],
    TFT_DAMAGE_SKIN: [],
    TFT_MAP_SKIN: [],
    WARD_SKIN: [],
    AUGMENT: [],
    BOOST: [],
    CURRENCY: [],
    EVENT_PASS: [],
    MODE_PROGRESSION_REWARD: [],
    QUEUE_ENTRY: [],
    REGALIA_CREST: [],
    SKIN_AUGMENT: [],
    SPELL_BOOK_PAGE: [],
    STATSTONE: [],
    TFT_EVENT_PVE_BUDDY: [],
    TFT_EVENT_PVE_DIFFICULT: [],
    TFT_PLAYBOOK: [],
    TFT_ZOOM_SKIN: [],
    TOURNAMENT_FLAG: [],
    TOURNAMENT_LOGO: [],
    TOURNAMENT_TROPHY: [],
  },
};

export const currentSummonerStore = store(initialState, {
  name: 'currentSummoner',
  devtools: { enabled: true },
})
  .actions((store) => ({
    resetState: () => {
      store.set(initialState);
    },
  }))
  .computed((store) => ({
    skins: () =>
      store.champions.use((champions) =>
        champions
          .map((c) => c.skins)
          .filter((s) => !!s)
          .flat(),
      ),
  }))
  .effects((store) => ({
    onChangeInventorySummonerIcon: () =>
      store.inventory.SUMMONER_ICON.onChange((inventory) => {
        const data: InventoryOwnedData[] = [];
        const iconsInfo = gameDataStore.icons.get();
        inventory.forEach((inv) => {
          if (!inv.owned) return;
          const info = iconsInfo.find((i) => i.id === inv.itemId);

          data.push({
            id: inv.itemId,
            name: info?.title ?? '',
            description:
              info?.descriptions.find((d) => d.region === 'riot')
                ?.description ?? '',
            img: info?.imagePath ?? '',
            purchaseDate: inv.purchaseDate,
          });
        });
        store.icons.set(data);
      }),
  }));
