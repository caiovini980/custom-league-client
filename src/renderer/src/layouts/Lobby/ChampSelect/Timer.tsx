import { LolChampSelectV1Session } from '@shared/typings/lol/response/lolChampSelectV1Session';
import { Stack, Typography } from '@mui/material';
import { useTimer } from '@render/hooks/useTimer';
import { useEffect } from 'react';

interface TimerProps {
  session: LolChampSelectV1Session;
}

export const Timer = ({ session }: TimerProps) => {
  const { time, startTimer, stopAndResetTimer } = useTimer();

  useEffect(() => {
    stopAndResetTimer();
    startTimer();
  }, [session.timer.adjustedTimeLeftInPhase]);

  const getTime = () => {
    const timeLeft =
      Math.floor(session.timer.adjustedTimeLeftInPhase / 1000) - time;
    if (timeLeft < 0) return 0;
    return timeLeft;
  };

  return (
    <Stack direction={'column'} alignItems={'center'} justifyContent={'center'}>
      <Typography fontSize={'1.2rem'}>{getTime()}</Typography>
    </Stack>
  );
};
