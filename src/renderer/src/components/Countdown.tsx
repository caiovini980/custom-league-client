import { Stack, Typography } from '@mui/material';
import { useCountdown } from '@render/hooks/useCountdown';
import { FaClock } from 'react-icons/fa6';

interface CountdownProps {
  endDate: string | undefined;
  fontSize?: string | number;
}

export const Countdown = ({ endDate, fontSize = '0.8rem' }: CountdownProps) => {
  const time = useCountdown(endDate);
  return (
    <Stack direction={'row'} columnGap={1} alignItems={'center'}>
      <FaClock />
      <Typography fontSize={fontSize}>{time}</Typography>
    </Stack>
  );
};
