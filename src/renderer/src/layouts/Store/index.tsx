import CustomTab, { CustomTabPanel } from '@render/components/CustomTab';
import { withSystemReady } from '@render/hoc/withSystemReady';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import { StoreCatalog } from '@render/layouts/Store/StoreCatalog';
import { storeStore } from '@render/zustand/stores/storeStore';
import { StoreView } from '@shared/typings/ipc-function/handle/store.typing';

interface Menu {
  name: StoreView;
  label: string;
}

export const Store = withSystemReady('store', () => {
  const { rcpFeLolCollections, rcpFeLolLoot, rcpFeLolClash } =
    useLeagueTranslate();

  const { rcpFeLolCollectionsTrans } = rcpFeLolCollections;
  const { rcpFeLolLootTrans } = rcpFeLolLoot;
  const { rcpFeLolClashTrans } = rcpFeLolClash;

  const menu: Menu[] = [
    {
      name: 'champions',
      label: rcpFeLolLootTrans('loot_category_CHAMPION'),
    },
    {
      name: 'skins',
      label: rcpFeLolLootTrans('loot_category_SKIN'),
    },
    {
      name: 'chromas',
      label: rcpFeLolCollectionsTrans('control_pane_breakdown_tooltip_chroma'),
    },
    {
      name: 'icons',
      label: rcpFeLolLootTrans('loot_category_SUMMONERICON'),
    },
    {
      name: 'ward_skins',
      label: rcpFeLolLootTrans('loot_category_WARDSKIN'),
    },
    {
      name: 'emotes',
      label: rcpFeLolLootTrans('loot_category_EMOTE'),
    },
    {
      name: 'tickets',
      label: rcpFeLolClashTrans(
        'clash_tournament_info_ticket_button_tooltip_header',
      ),
    },
  ];

  const onClick = (menu: StoreView) => {
    storeStore.currentTab.set(menu);
  };

  return (
    <CustomTab onChange={(t) => onClick(t.name as StoreView)}>
      {menu.map((m) => (
        <CustomTabPanel key={m.name} label={m.label} name={m.name}>
          <StoreCatalog view={m.name} />
        </CustomTabPanel>
      ))}
    </CustomTab>
  );
});
