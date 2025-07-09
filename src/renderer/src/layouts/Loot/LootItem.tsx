import { LolLootV1PlayerLoot } from '@shared/typings/lol/response/lolLootV1PlayerLoot';
import { ButtonBase, Paper, Tooltip, Typography } from '@mui/material';
import { useState } from 'react';
import { SquareIcon } from '@render/components/SquareIcon';
import { LootContextMenu } from '@render/layouts/Loot/LootContextMenu';
import { useLootUtil } from '@render/layouts/Loot/useLootUtil';
import { LootTooltip } from '@render/layouts/Loot/LootTooltip';
import { useLootContext } from '@render/layouts/Loot/LootContext';

interface LootItemProps {
  loot: LolLootV1PlayerLoot;
}

export const LootItem = ({ loot }: LootItemProps) => {
  const { getLootImg } = useLootUtil();
  const { behaviorToSlot, addLootInSlot } = useLootContext();

  const [lootSelected, setLootSelected] = useState(false);

  const border = () => {
    const b = (color: string) => `2px solid var(--mui-palette-${color})`;
    if (['SKIN', 'CHAMPION', 'WARDSKIN'].includes(loot.type)) {
      return b('highlight');
    }
    return b('divider');
  };

  const onClickItem = () => {
    if (behaviorToSlot(loot)) {
      addLootInSlot(loot);
    } else {
      setLootSelected(true);
    }
  };

  return (
    <>
      <Tooltip
        title={<LootTooltip loot={loot} />}
        disableInteractive
        leaveDelay={50}
        slotProps={{
          tooltip: {
            sx: { p: 0, overflow: 'hidden' },
          },
        }}
      >
        <Paper
          variant={'outlined'}
          component={ButtonBase}
          onClick={onClickItem}
          sx={{
            position: 'relative',
            border: border(),
          }}
        >
          <SquareIcon src={getLootImg(loot)} size={70} />
          <Typography
            sx={{
              position: 'absolute',
              bottom: 0,
              right: 0,
            }}
          >
            {loot.count}
          </Typography>
        </Paper>
      </Tooltip>
      <LootContextMenu
        lootSelected={lootSelected}
        handleClose={() => setLootSelected(false)}
        loot={loot}
      />
    </>
  );
};
