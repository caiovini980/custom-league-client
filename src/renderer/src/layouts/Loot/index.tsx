import { Divider, Grid, Stack, Typography } from '@mui/material';
import { CentralizedStack } from '@render/components/CentralizedStack';
import { CircularIcon } from '@render/components/CircularIcon';
import { LoadingScreen } from '@render/components/LoadingScreen';
import { withSystemReady } from '@render/hoc/withSystemReady';
import { useLeagueClientEvent } from '@render/hooks/useLeagueClientEvent';
import { useLeagueImage } from '@render/hooks/useLeagueImage';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import {
  LootActionModal,
  LootActionModalRef,
} from '@render/layouts/Loot/LootActionModal';
import { LootContext } from '@render/layouts/Loot/LootContext';
import {
  LootContextMenu,
  LootContextMenuRef,
} from '@render/layouts/Loot/LootContextMenu';
import { LootItem } from '@render/layouts/Loot/LootItem';
import { LootSlot } from '@render/layouts/Loot/LootSlot';
import { useLootUtil } from '@render/layouts/Loot/useLootUtil';
import {
  CatalogItemModal,
  CatalogItemModalRef,
} from '@render/layouts/Store/StoreCatalog/CatalogItemModal';
import { LolLootV1PlayerLoot } from '@shared/typings/lol/response/lolLootV1PlayerLoot';
import { LolLootV1PlayerLoot_Id_ContextMenu } from '@shared/typings/lol/response/lolLootV1PlayerLoot_Id_ContextMenu';
import { useRef, useState } from 'react';

export const Loot = withSystemReady('loot', () => {
  const { genericImg } = useLeagueImage();
  const { rcpFeLolLoot } = useLeagueTranslate();
  const { getLootName } = useLootUtil();

  const { rcpFeLolLootTrans } = rcpFeLolLoot;

  const [loot, setLoot] = useState<LolLootV1PlayerLoot[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  const lootActionModalRef = useRef<LootActionModalRef>(null);
  const catalogItemModalRef = useRef<CatalogItemModalRef>(null);
  const contextMenuRef = useRef<LootContextMenuRef>(null);

  useLeagueClientEvent('/lol-loot/v1/player-loot', (data) => {
    setLoot(data);
  });

  useLeagueClientEvent('/lol-loot/v1/player-loot-map', (data) => {
    setLoot(
      Object.keys(data).map((lootId) => {
        return data[lootId];
      }),
    );
  });

  useLeagueClientEvent('/lol-loot/v1/player-display-categories', (data) => {
    setCategories(data);
  });

  const getLootFiltered = (category: string) => {
    const compareType = (
      a: LolLootV1PlayerLoot,
      b: LolLootV1PlayerLoot,
    ): number => {
      if (!a.type.endsWith('_RENTAL') && b.type.endsWith('_RENTAL')) {
        return -1;
      }
      if (a.type.endsWith('_RENTAL') && !b.type.endsWith('_RENTAL')) {
        return 1;
      }
      return 0;
    };

    return loot
      .filter((l) => l.displayCategories.startsWith(category))
      .sort((a, b) => getLootName(a).localeCompare(getLootName(b)))
      .sort(compareType);
  };

  const getLootCurrency = () => {
    const lootIdList = [
      'MATERIAL_key',
      'CURRENCY_cosmetic',
      'CHEST_generic',
      'CHEST_224',
      'CHEST_687',
    ];
    const loots = loot.filter((l) => lootIdList.includes(l.lootId));
    const chestLoot = loots.filter((l) => l.type === 'CHEST');
    const otherLoot = loots.filter((l) => l.type !== 'CHEST');

    const genericChest = chestLoot.find((l) => l.lootId === 'CHEST_generic');

    if (!genericChest) return otherLoot;
    const count = chestLoot.reduce((prev, curr) => prev + curr.count, 0);

    return [...otherLoot, { ...genericChest, count }];
  };

  const onClickDisenchant = (
    loot: LolLootV1PlayerLoot,
    menu: LolLootV1PlayerLoot_Id_ContextMenu,
  ) => {
    lootActionModalRef.current?.open(loot, menu);
  };
  const onClickBuyChampion = (itemId: number) => {
    catalogItemModalRef.current?.open('CHAMPION', itemId);
  };

  if (!categories.length) {
    return (
      <CentralizedStack>
        <LoadingScreen />
      </CentralizedStack>
    );
  }

  return (
    <LootContext loots={loot}>
      <Stack direction={'row'} height={'100%'} width={'100%'}>
        <Stack direction={'column'} height={'100%'} width={'100%'}>
          <Stack
            direction={'column'}
            overflow={'auto'}
            height={'100%'}
            width={'100%'}
            rowGap={4}
            p={1}
          >
            {categories.map((lootTypeKey) => {
              return (
                <Stack key={lootTypeKey} direction={'column'} width={'100%'}>
                  <Stack
                    direction={'row'}
                    alignItems={'center'}
                    width={'90%'}
                    columnGap={1}
                    mb={1}
                  >
                    <Typography whiteSpace={'nowrap'}>
                      {rcpFeLolLootTrans(`loot_category_${lootTypeKey}`)}
                    </Typography>
                    <Divider orientation={'horizontal'} sx={{ flex: 1 }} />
                  </Stack>
                  <Grid container spacing={2} alignItems={'center'}>
                    {getLootFiltered(lootTypeKey).map((l) => {
                      return (
                        <Grid key={l.lootId} id={`loot_${l.lootId}`}>
                          <LootItem
                            loot={l}
                            onOpenContextMenu={() =>
                              contextMenuRef.current?.open(l)
                            }
                          />
                        </Grid>
                      );
                    })}
                  </Grid>
                </Stack>
              );
            })}
          </Stack>
          <Stack
            direction={'row'}
            columnGap={3}
            alignItems={'center'}
            justifyContent={'center'}
            position={'sticky'}
            bottom={0}
            width={'100%'}
            flexShrink={0}
            p={1}
            sx={{
              borderTop: '1px solid var(--mui-palette-divider)',
              background: 'var(--mui-palette-background-paper)',
            }}
          >
            {getLootCurrency().map((loot) => (
              <Stack
                key={loot.lootId}
                direction={'column'}
                alignItems={'center'}
              >
                <CircularIcon
                  src={genericImg(
                    `plugins/rcp-fe-lol-loot/global/default/assets/tray_icons/${loot.lootName.toLowerCase()}.png`,
                  )}
                  size={28}
                />
                <Typography fontSize={'0.8rem'}>{loot.count}</Typography>
              </Stack>
            ))}
          </Stack>
        </Stack>
        <LootSlot />
        <LootActionModal ref={lootActionModalRef} />
        <CatalogItemModal ref={catalogItemModalRef} />
        <LootContextMenu
          ref={contextMenuRef}
          onClickDisenchant={onClickDisenchant}
          onClickBuyChampion={onClickBuyChampion}
        />
      </Stack>
    </LootContext>
  );
});
