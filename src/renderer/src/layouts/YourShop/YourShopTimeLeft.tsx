import { Stack, Typography } from '@mui/material';
import { useCountdown } from '@render/hooks/useCountdown';
import { FaClock } from 'react-icons/fa6';

interface YourShopTimeLeftProps {
  endDate: string | undefined;
}

export const YourShopTimeLeft = ({ endDate }: YourShopTimeLeftProps) => {
  const time = useCountdown(endDate);
  return (
    <Stack direction={'row'} columnGap={1} alignItems={'center'}>
      <FaClock />
      <Typography fontSize={'2rem'}>{time}</Typography>
    </Stack>
  );
};
