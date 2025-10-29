import { Typography } from '@mui/material';
import { lobbyStore } from '@render/zustand/stores/lobbyStore';
import { secondsToDisplayTime } from '@shared/utils/date.util';

export const TimeInQueue = () => {
  const timeInQueue = lobbyStore.matchMaking.use((s) => s?.timeInQueue ?? 0);

  return (
    <Typography fontSize={'1.5rem'} textAlign={'center'}>
      {secondsToDisplayTime(timeInQueue)}
    </Typography>
  );
};
