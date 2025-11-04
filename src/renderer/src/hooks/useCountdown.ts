import { useTimer } from '@render/hooks/useTimer';
import { secondsToDisplayTime } from '@shared/utils/date.util';
import { differenceInSeconds, parseISO } from 'date-fns';
import { useEffect, useMemo } from 'react';

export const useCountdown = (endDate: string | undefined) => {
  const { time, startTimer, resetTimer } = useTimer();

  const t = useMemo(() => {
    if (!endDate) return '';
    const totalSeconds = differenceInSeconds(parseISO(endDate), new Date());
    const [days, hours, minutes, seconds] = secondsToDisplayTime(
      totalSeconds,
      true,
    ).split(':');
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }, [endDate, time]);

  useEffect(() => {
    resetTimer();
    startTimer();
  }, [endDate]);

  return t;
};
