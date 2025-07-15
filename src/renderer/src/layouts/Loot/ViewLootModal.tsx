import { forwardRef, useImperativeHandle, useState } from 'react';
import {
  LolLootV1CraftMass,
  LolLootV1CraftMassDetail,
} from '@shared/typings/lol/response/lolLootV1CraftMass';
import CustomDialog, {
  CustomDialogCloseFloatingButton,
} from '@render/components/CustomDialog';
import { SquareIcon } from '@render/components/SquareIcon';
import { useLootUtil } from '@render/layouts/Loot/useLootUtil';
import { Grid, Stack, Typography } from '@mui/material';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import { useLeagueImage } from '@render/hooks/useLeagueImage';

export interface ViewLootModalRef {
  open: (loots: LolLootV1CraftMass) => void;
}

export const ViewLootModal = forwardRef<ViewLootModalRef>((_, ref) => {
  const { genericImg } = useLeagueImage();
  const { rcpFeLolLoot } = useLeagueTranslate();
  const { getLootImg, getLootName } = useLootUtil();

  const { rcpFeLolLootTrans } = rcpFeLolLoot;

  const [open, setOpen] = useState(false);
  const [loots, setLoots] = useState<LolLootV1CraftMassDetail[]>([]);

  useImperativeHandle(
    ref,
    () => {
      return {
        open: (loots) => {
          setOpen(true);
          setLoots([...loots.added, ...loots.redeemed]);
        },
      };
    },
    [],
  );

  return (
    <CustomDialog
      open={open}
      maxWidth={'sm'}
      fullWidth
      actionsComponent={<div />}
      dialogContentProps={{
        sx: {
          p: 0,
          position: 'relative',
          minHeight: 350,
          display: 'flex',
          alignItems: 'center',
          background: `url(${genericImg('plugins/rcp-fe-lol-loot/global/default/background.jpg')})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
        },
      }}
    >
      <CustomDialogCloseFloatingButton handleClose={() => setOpen(false)} />
      <Stack
        direction={'column'}
        rowGap={2}
        alignItems={'center'}
        width={'100%'}
        height={'100%'}
      >
        <Typography>
          {rcpFeLolLootTrans('loot_redeem_notification_body')}
        </Typography>
        <Grid
          container
          alignItems={'center'}
          justifyContent={'center'}
          spacing={2}
          height={'100%'}
          width={'100%'}
        >
          {loots.map((l) => {
            return (
              <Grid key={l.playerLoot.lootId}>
                <Stack
                  direction={'column'}
                  alignItems={'center'}
                  justifyContent={'center'}
                  rowGap={1}
                  sx={{
                    border: '1px solid var(--mui-palette-divider)',
                    borderRadius: '4px',
                  }}
                >
                  <SquareIcon src={getLootImg(l.playerLoot)} size={180} />
                  <Typography>{getLootName(l.playerLoot)}</Typography>
                  <Typography>{l.deltaCount}</Typography>
                </Stack>
              </Grid>
            );
          })}
        </Grid>
      </Stack>
    </CustomDialog>
  );
});
