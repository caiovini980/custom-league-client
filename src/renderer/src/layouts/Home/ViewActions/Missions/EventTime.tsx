import { useTimer } from '@render/hooks/useTimer';
import { useEffect, useMemo } from 'react';
import { differenceInSeconds, parseISO } from 'date-fns';
import { secondsToDisplayTime } from '@shared/utils/date.util';
import { Stack, Typography } from '@mui/material';
import { FaClock } from 'react-icons/fa6';

interface EventTimeProps {
  progressEndDate: string;
}

export const EventTime = ({ progressEndDate }: EventTimeProps) => {
  const { time, startTimer, resetTimer } = useTimer();

  const t = useMemo(() => {
    const totalSeconds = differenceInSeconds(
      parseISO(progressEndDate),
      new Date(),
    );
    const [days, hours, minutes, seconds] = secondsToDisplayTime(
      totalSeconds,
      true,
    ).split(':');
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }, [progressEndDate, time]);

  useEffect(() => {
    resetTimer();
    startTimer();
  }, [progressEndDate]);

  return (
    <Stack direction={'row'} columnGap={1} alignItems={'center'}>
      <FaClock />
      <Typography fontSize={'0.8rem'}>{t}</Typography>
    </Stack>
  );
};
