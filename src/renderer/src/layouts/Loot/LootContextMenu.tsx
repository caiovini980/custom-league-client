import { LolLootV1PlayerLoot } from '@shared/typings/lol/response/lolLootV1PlayerLoot';
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
import { buildEventUrl } from '@render/hooks/useLeagueClientEvent';
import { useEffect, useRef, useState } from 'react';
import { LolLootV1PlayerLoot_Id_ContextMenu } from '@shared/typings/lol/response/lolLootV1PlayerLoot_Id_ContextMenu';
import { useLeagueClientRequest } from '@render/hooks/useLeagueClientRequest';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import { useLootUtil } from '@render/layouts/Loot/useLootUtil';
import {
  LootActionModal,
  LootActionModalRef,
} from '@render/layouts/Loot/LootActionModal';
import { useLootContext } from '@render/layouts/Loot/LootContext';

interface LootContextMenuProps {
  lootSelected: boolean;
  handleClose: () => void;
  loot: LolLootV1PlayerLoot;
}

export const LootContextMenu = ({
  lootSelected,
  handleClose,
  loot,
}: LootContextMenuProps) => {
  const { makeRequest } = useLeagueClientRequest();
  const { rcpFeLolLoot } = useLeagueTranslate();
  const { getLootName } = useLootUtil();
  const { setSlot } = useLootContext();

  const { rcpFeLolLootTrans } = rcpFeLolLoot;

  const anchorRef = document.getElementById(`loot_${loot.lootId}`);
  const open = lootSelected;

  const modalRef = useRef<LootActionModalRef>(null);

  const [contextMenu, setContextMenu] = useState<
    LolLootV1PlayerLoot_Id_ContextMenu[]
  >([]);

  const getContextMenu = (menu: LolLootV1PlayerLoot_Id_ContextMenu) => {
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
    handleClose();
    if (['DISENCHANT'].includes(menu.actionType)) {
      modalRef.current?.open(menu);
    }
    if (['REROLL', 'UPGRADE', 'OPEN', 'redeem'].includes(menu.actionType)) {
      setSlot(loot, menu);
    }
    if (['purchase_champion'].includes(menu.actionType)) {
      console.log(loot, menu);
      //TODO: purchase champion screen
    }
  };

  useEffect(() => {
    if (!open) return;
    makeRequest(
      'GET',
      buildEventUrl('/lol-loot/v1/player-loot/{id}/context-menu', loot.lootId),
      undefined,
    ).then((res) => {
      if (res.ok) {
        setContextMenu(res.body);
      }
    });
  }, [open]);

  return (
    <>
      <Popper
        open={open}
        anchorEl={anchorRef}
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
                onClickAway={handleClose}
              >
                <Stack
                  position={'relative'}
                  direction={'column'}
                  component={Paper}
                  minWidth={340}
                >
                  <Stack direction={'column'} p={1}>
                    <Typography>{getLootName(loot)}</Typography>
                    <Typography color={'textDisabled'} fontSize={'0.7rem'}>
                      {rcpFeLolLootTrans(
                        `loot_type_${loot.type.toLowerCase()}`,
                      )}
                    </Typography>
                  </Stack>
                  <Divider flexItem>
                    <Box component={Paper} variant={'outlined'} p={0.5}>
                      <Typography fontSize={'0.7rem'}>
                        {rcpFeLolLootTrans(
                          `loot_tooltip_short_${loot.redeemableStatus}`,
                        )}
                      </Typography>
                    </Box>
                  </Divider>
                  <MenuList
                    autoFocusItem={open}
                    id="composition-menu"
                    aria-labelledby="composition-button"
                  >
                    {contextMenu.map((menu) => {
                      return (
                        <MenuItem
                          key={menu.name}
                          disabled={
                            !menu.enabled ||
                            menu.actionType === 'purchase_champion'
                          }
                          onClick={() => onClickContext(menu)}
                        >
                          {getContextMenu(menu)}
                        </MenuItem>
                      );
                    })}
                  </MenuList>
                </Stack>
              </ClickAwayListener>
            </div>
          </Grow>
        )}
      </Popper>
      <LootActionModal loot={loot} ref={modalRef} />
    </>
  );
};
