import {
  Box,
  ClickAwayListener,
  Divider,
  Grow,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Stack,
  Typography,
} from '@mui/material';
import { LoadingScreen } from '@render/components/LoadingScreen';
import { buildEventUrl } from '@render/hooks/useLeagueClientEvent';
import { useLeagueClientRequest } from '@render/hooks/useLeagueClientRequest';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import { useSnackNotification } from '@render/hooks/useSnackNotification';
import { useLootContext } from '@render/layouts/Loot/LootContext';
import { useLootUtil } from '@render/layouts/Loot/useLootUtil';
import { LolLootV1PlayerLoot } from '@shared/typings/lol/response/lolLootV1PlayerLoot';
import { LolLootV1PlayerLoot_Id_ContextMenu } from '@shared/typings/lol/response/lolLootV1PlayerLoot_Id_ContextMenu';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';

export interface LootContextMenuRef {
  open: (loot: LolLootV1PlayerLoot) => void;
}

interface LootContextMenuProps {
  onClickDisenchant: (
    loot: LolLootV1PlayerLoot,
    menu: LolLootV1PlayerLoot_Id_ContextMenu,
  ) => void;
  onClickBuyChampion: (itemId: number) => void;
}

export const LootContextMenu = forwardRef<
  LootContextMenuRef,
  LootContextMenuProps
>(({ onClickDisenchant, onClickBuyChampion }, ref) => {
  const { makeRequest } = useLeagueClientRequest();
  const { rcpFeLolLoot } = useLeagueTranslate();
  const { getLootName } = useLootUtil();
  const { setSlot } = useLootContext();
  const { snackError } = useSnackNotification();

  const { rcpFeLolLootTrans } = rcpFeLolLoot;

  const [popperData, setPopperData] = useState({
    open: false,
    loot: {} as LolLootV1PlayerLoot,
    lastLootIdClosed: '',
  });

  const [contextMenu, setContextMenu] = useState({
    loading: false,
    contextMenu: [] as LolLootV1PlayerLoot_Id_ContextMenu[],
  });

  useImperativeHandle(ref, () => {
    return {
      open: (loot) =>
        setPopperData((prev) => ({
          open: prev.lastLootIdClosed !== loot.lootId,
          lastLootIdClosed: '',
          loot,
        })),
    };
  }, []);

  const getContextMenu = (menu: LolLootV1PlayerLoot_Id_ContextMenu) => {
    const loot = popperData.loot;
    if (loot.type === 'CHEST') {
      const name = getLootName(loot);
      const desc = rcpFeLolLootTrans('loot_recipe_name_chest_generic_open');
      return `${desc} ${name}`;
    }
    const key = menu.name
      .replace(/STATSTONE(_SHARD)?/, 'CHAMPION')
      .toLowerCase();
    const name = rcpFeLolLootTrans(`loot_recipe_name_${key}`);
    let desc = rcpFeLolLootTrans(`loot_recipe_desc_${key}`);
    if (loot.type.startsWith('STATSTONE') && menu.actionType !== 'DISENCHANT') {
      desc = rcpFeLolLootTrans('loot_type_statstone_shard');
    }
    return `${name} ${desc}`;
  };

  const onClickContext = (menu: LolLootV1PlayerLoot_Id_ContextMenu) => {
    const loot = popperData.loot;
    handleClose(false);
    if (['DISENCHANT', 'redeem'].includes(menu.actionType)) {
      onClickDisenchant(loot, menu);
    }
    if (['REROLL', 'UPGRADE', 'OPEN'].includes(menu.actionType)) {
      setSlot(loot, menu);
    }
    if (['purchase_champion'].includes(menu.actionType)) {
      onClickBuyChampion(loot.parentStoreItemId);
    }
  };

  const handleClose = (rememberLastLoot = true) => {
    setPopperData((prev) => ({
      ...prev,
      lastLootIdClosed: rememberLastLoot ? prev.loot.lootId : '',
      open: false,
    }));
  };

  useEffect(() => {
    if (!popperData.open) {
      setContextMenu({
        contextMenu: [],
        loading: false,
      });
      return;
    }
    setContextMenu({
      contextMenu: [],
      loading: true,
    });
    makeRequest(
      'GET',
      buildEventUrl(
        '/lol-loot/v1/player-loot/{id}/context-menu',
        popperData.loot.lootId,
      ),
      undefined,
    ).then((res) => {
      if (res.ok) {
        setContextMenu({
          contextMenu: res.body,
          loading: false,
        });
      } else {
        handleClose(false);
        snackError(rcpFeLolLootTrans('loot_loading_fail'));
      }
    });
  }, [popperData.open]);

  return (
    <Popper
      open={popperData.open}
      anchorEl={document.getElementById(`loot_${popperData.loot.lootId}`)}
      placement="right-start"
      transition
      disablePortal
      sx={{
        zIndex: (t) => t.zIndex.tooltip + 1,
      }}
    >
      {({ TransitionProps }) => (
        <Grow {...TransitionProps}>
          <div>
            <ClickAwayListener
              mouseEvent="onMouseDown"
              touchEvent="onTouchStart"
              onClickAway={() => handleClose()}
            >
              <Stack
                position={'relative'}
                direction={'column'}
                component={Paper}
                minWidth={340}
              >
                <Stack direction={'column'} p={1}>
                  <Typography>{getLootName(popperData.loot)}</Typography>
                  <Typography color={'textDisabled'} fontSize={'0.7rem'}>
                    {rcpFeLolLootTrans(
                      `loot_type_${popperData.loot.type.toLowerCase()}`,
                    )}
                  </Typography>
                </Stack>
                <Divider flexItem>
                  <Box component={Paper} variant={'outlined'} p={0.5}>
                    <Typography fontSize={'0.7rem'}>
                      {rcpFeLolLootTrans(
                        `loot_tooltip_short_${popperData.loot.redeemableStatus}`,
                      )}
                    </Typography>
                  </Box>
                </Divider>
                <Box position={'relative'}>
                  <LoadingScreen loading={contextMenu.loading} />
                  <MenuList
                    autoFocusItem={popperData.open}
                    id="composition-menu"
                    aria-labelledby="composition-button"
                  >
                    {contextMenu.contextMenu.map((menu) => {
                      return (
                        <MenuItem
                          key={menu.name}
                          disabled={!menu.enabled}
                          onClick={() => onClickContext(menu)}
                        >
                          {getContextMenu(menu)}
                        </MenuItem>
                      );
                    })}
                  </MenuList>
                </Box>
              </Stack>
            </ClickAwayListener>
          </div>
        </Grow>
      )}
    </Popper>
  );
});
