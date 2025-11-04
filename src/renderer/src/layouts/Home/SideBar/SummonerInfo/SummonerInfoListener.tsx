import {
  buildEventUrl,
  onLeagueClientEvent,
  useLeagueClientEvent,
} from '@render/hooks/useLeagueClientEvent';
import { useLeagueClientRequest } from '@render/hooks/useLeagueClientRequest';
import { currentSummonerStore } from '@render/zustand/stores/currentSummonerStore';
import { InventoryType } from '@shared/typings/lol/response/lolInventoryV2Inventory_Id';
import { useEffect } from 'react';

interface SummonerInfoListenerProps {
  summonerId: number;
}

export const SummonerInfoListener = ({
  summonerId,
}: SummonerInfoListenerProps) => {
  const { makeRequest } = useLeagueClientRequest();

  useLeagueClientEvent(
    buildEventUrl(
      '/lol-champions/v1/inventories/{digits}/champions',
      summonerId,
    ),
    (data) => {
      currentSummonerStore.champions.set(data);
    },
  );

  useLeagueClientEvent('/lol-inventory/v2/inventory/{string}', (data, ev) => {
    const inventoryType = ev.split('/').at(-1) as InventoryType;

    if (!inventoryType) return;

    currentSummonerStore.inventory.assign({
      [inventoryType]: data,
    });
  });

  useEffect(() => {
    const events: { unsubscribe: () => void }[] = [];

    const inventoryType: Record<InventoryType, null> = {
      ACHIEVEMENT_TITLE: null,
      CHAMPION: null,
      CHAMPION_SKIN: null,
      COMPANION: null,
      EMOTE: null,
      NEXUS_FINISHER: null,
      REGALIA_BANNER: null,
      SKIN_BORDER: null,
      SUMMONER_ICON: null,
      TFT_DAMAGE_SKIN: null,
      TFT_MAP_SKIN: null,
      WARD_SKIN: null,
      AUGMENT: null,
      BOOST: null,
      CURRENCY: null,
      EVENT_PASS: null,
      MODE_PROGRESSION_REWARD: null,
      QUEUE_ENTRY: null,
      REGALIA_CREST: null,
      SKIN_AUGMENT: null,
      SPELL_BOOK_PAGE: null,
      STATSTONE: null,
      TFT_EVENT_PVE_BUDDY: null,
      TFT_EVENT_PVE_DIFFICULT: null,
      TFT_PLAYBOOK: null,
      TFT_ZOOM_SKIN: null,
      TOURNAMENT_FLAG: null,
      TOURNAMENT_LOGO: null,
      TOURNAMENT_TROPHY: null,
    };

    Object.keys(inventoryType).forEach((inventoryType) => {
      const url = buildEventUrl(
        '/lol-inventory/v2/inventory/{string}',
        inventoryType,
      );
      makeRequest('GET', url, undefined).then((res) => {
        if (res.ok) {
          currentSummonerStore.inventory.assign({
            [inventoryType]: res.body,
          });
        }
      });

      const ev = onLeagueClientEvent(
        url,
        (data) => {
          currentSummonerStore.inventory.assign({
            [inventoryType]: data,
          });
        },
        false,
      );
      events.push(ev);
    });

    return () => {
      events.forEach((ev) => {
        ev.unsubscribe();
      });
    };
  }, []);

  return null;
};
