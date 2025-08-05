import { Divider, Stack, Typography } from '@mui/material';
import { CustomIconButtonTooltip } from '@render/components/input';
import { useLeagueClientEvent } from '@render/hooks/useLeagueClientEvent';
import { LolServiceStatusV1TickerMessages } from '@shared/typings/lol/response/lolServiceStatusV1TickerMessages';
import { formatDateTime } from '@shared/utils/date.util';
import { useState } from 'react';
import { BsDot } from 'react-icons/bs';
import { FaCircleExclamation } from 'react-icons/fa6';

export const ClientStatus = () => {
  const [status, setStatus] = useState<LolServiceStatusV1TickerMessages[]>([]);

  useLeagueClientEvent('/lol-service-status/v1/ticker-messages', (data) => {
    setStatus(data);
  });

  const content = () => {
    const color = {
      info: 'var(--mui-palette-info-main)',
      error: 'var(--mui-palette-error-main)',
    };
    return (
      <Stack direction={'column'} rowGap={1} divider={<Divider />}>
        {status.map((s) => (
          <Stack key={s.heading} alignItems={'center'} rowGap={1}>
            <Stack
              direction={'row'}
              justifyContent={'center'}
              alignItems={'center'}
              columnGap={1}
            >
              <BsDot size={30} color={color[s.severity]} />
              <Typography textAlign={'center'} fontSize={'1.2rem'}>
                {s.heading}
              </Typography>
            </Stack>
            <Typography fontSize={'0.8rem'}>{s.message}</Typography>
            <Typography fontSize={'0.6rem'}>
              {formatDateTime(s.createdAt)}
            </Typography>
          </Stack>
        ))}
      </Stack>
    );
  };

  const getExclamationColor = () => {
    const hasError = status.some((s) => s.severity === 'error')
    if (hasError) return 'var(--mui-palette-error-main)'
    return 'var(--mui-palette-info-main)'
  }

  if (!status.length) return <div />;

  return (
    <CustomIconButtonTooltip
      placement={'right'}
      openTooltipOnClick
      title={content()}
      arrow={false}
      sx={{
        p: 1,
      }}
    >
      <FaCircleExclamation size={20} color={getExclamationColor()} />
    </CustomIconButtonTooltip>
  );
};
