import { Stack, Tooltip, Typography } from '@mui/material';
import { CircularIcon } from '@render/components/CircularIcon';
import { useLeagueClientEvent } from '@render/hooks/useLeagueClientEvent';
import { useLeagueImage } from '@render/hooks/useLeagueImage';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import { leagueClientStore } from '@render/zustand/stores/leagueClientStore';
import { formatCurrency } from '@shared/utils/string.util';

export const Wallet = () => {
  const wallet = leagueClientStore.wallet.use();

  const { loadEventData } = useLeagueClientEvent(
    '/lol-inventory/v1/wallet/ALL',
    (data) => {
      leagueClientStore.wallet.set({
        rp: data.RP,
        blueEssence: data.lol_blue_essence,
      });
    },
  );

  useLeagueClientEvent('/lol-inventory/v1/wallet/{string}', () => {
    loadEventData();
  });

  return (
    <Stack
      direction={'column'}
      rowGap={0.5}
      height={'100%'}
      justifyContent={'center'}
      mr={1}
      py={0.2}
    >
      <Icon
        src={'icon-rp-24.png'}
        value={wallet.rp}
        tooltipKey={'riotPoints'}
      />
      <Icon
        src={'icon-be-150.png'}
        value={wallet.blueEssence}
        tooltipKey={'blueEssence'}
      />
    </Stack>
  );
};

const Icon = (props: { tooltipKey: string; src: string; value: number }) => {
  const { rcpFeLolNavigation } = useLeagueTranslate();
  const { genericImg } = useLeagueImage();

  const { rcpFeLolNavigationTrans } = rcpFeLolNavigation;

  return (
    <Tooltip
      title={rcpFeLolNavigationTrans(props.tooltipKey)}
      placement={'left'}
      disableInteractive
      arrow
    >
      <Stack
        direction={'row'}
        columnGap={0.5}
        alignItems={'center'}
        height={'100%'}
      >
        <CircularIcon
          src={genericImg(
            `plugins/rcp-fe-lol-static-assets/global/default/${props.src}`,
          )}
          size={16}
        />
        <Typography fontSize={'0.75rem'}>
          {formatCurrency(props.value, 0)}
        </Typography>
      </Stack>
    </Tooltip>
  );
};
