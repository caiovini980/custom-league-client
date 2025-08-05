import { Stack, Typography } from '@mui/material';
import { useCountdown } from '@render/hooks/useCountdown';
import { FaClock } from 'react-icons/fa6';

interface EventTimeProps {
  progressEndDate: string;
}

export const EventTime = ({ progressEndDate }: EventTimeProps) => {
  const time = useCountdown(progressEndDate);

  return (
    <Stack direction={'row'} columnGap={1} alignItems={'center'}>
      <FaClock />
      <Typography fontSize={'0.8rem'}>{time}</Typography>
    </Stack>
  );
};
