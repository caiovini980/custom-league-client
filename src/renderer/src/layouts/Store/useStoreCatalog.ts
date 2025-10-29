import { useLeagueImage } from '@render/hooks/useLeagueImage';
import { electronHandle } from '@render/utils/electronFunction.util';
import { storeStore } from '@render/zustand/stores/storeStore';
import { StoreView } from '@shared/typings/ipc-function/handle/store.typing';
import { useState } from 'react';

export const useStoreCatalog = () => {
  const {
    loadChampionBackgroundImg,
    loadChampionSkin,
    genericImg,
    profileIcon,
    wardIcon,
    emoteIcon,
  } = useLeagueImage();

  const [loading, setLoading] = useState(false);

  const reloadCurrentCatalog = () => {
    const currentTab = storeStore.currentTab.get();
    return loadCatalog(currentTab);
  };

  const loadCatalog = (currentTab: StoreView) => {
    setLoading(true);
    electronHandle.store
      .getStoreData(currentTab)
      .then((res) => {
        storeStore.data.assign({
          [currentTab]: res,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getItemImg = (inventoryType: string, itemId: number) => {
    if (inventoryType === 'CHAMPION') {
      return loadChampionBackgroundImg('splashPath', itemId);
    }
    if (inventoryType === 'CHAMPION_SKIN') {
      return loadChampionSkin(itemId);
    }
    if (inventoryType === 'SUMMONER_ICON') {
      return profileIcon(itemId);
    }
    if (inventoryType === 'WARD_SKIN') {
      return wardIcon(itemId);
    }
    if (inventoryType === 'EMOTE') {
      return emoteIcon(itemId);
    }
    return '';
  };

  const chromaBg = genericImg(
    'plugins/rcp-fe-lol-paw/global/default/images/bg-chroma-card.jpg',
  );

  return {
    loadCatalog,
    reloadCurrentCatalog,
    loading,
    getItemImg: (inventoryType: string, itemId: number) =>
      `url(${getItemImg(inventoryType, itemId)}), url(${chromaBg})`,
    chromaBg,
  };
};
