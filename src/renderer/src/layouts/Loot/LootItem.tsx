import { ButtonBase, Paper, Tooltip, Typography } from '@mui/material';
import { SquareIcon } from '@render/components/SquareIcon';
import { useLootContext } from '@render/layouts/Loot/LootContext';
import { LootTooltip } from '@render/layouts/Loot/LootTooltip';
import { useLootUtil } from '@render/layouts/Loot/useLootUtil';
import { LolLootV1PlayerLoot } from '@shared/typings/lol/response/lolLootV1PlayerLoot';

interface LootItemProps {
  loot: LolLootV1PlayerLoot;
  onOpenContextMenu: (loot: LolLootV1PlayerLoot) => void;
}

export const LootItem = ({ loot, onOpenContextMenu }: LootItemProps) => {
  const { getLootImg } = useLootUtil();
  const { behaviorToSlot, addLootInSlot } = useLootContext();

  const border = () => {
    const b = (color: string) => `2px solid var(--mui-palette-${color})`;
    if (['SKIN', 'CHAMPION', 'WARDSKIN'].includes(loot.type)) {
      return b('highlight-main');
    }
    return b('divider');
  };

  const onClickItem = () => {
    if (behaviorToSlot(loot)) {
      addLootInSlot(loot);
    } else {
      onOpenContextMenu(loot);
    }
  };

  return (
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
        <SquareIcon src={getLootImg(loot)} size={120} />
        <Typography
          sx={{
            position: 'absolute',
            bottom: 3,
            right: 3,
            background: 'var(--mui-palette-background-paper)',
            borderRadius: '50%',
            p: 0.3,
            width: 30,
            height: 30,
          }}
        >
          {loot.count}
        </Typography>
      </Paper>
    </Tooltip>
  );
};
