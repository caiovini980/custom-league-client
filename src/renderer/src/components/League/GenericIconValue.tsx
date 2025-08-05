import { Stack, Typography } from '@mui/material';
import { CircularIcon } from '@render/components/CircularIcon';
import { useLeagueImage } from '@render/hooks/useLeagueImage';

interface GenericIconValueProps {
  inverter?: boolean;
  src: string;
  value: string | number;
  size?: number;
}

export const GenericIconValue = ({
  inverter,
  size,
  src,
  value,
}: GenericIconValueProps) => {
  const { genericImg } = useLeagueImage();

  return (
    <Stack
      direction={inverter ? 'row-reverse' : 'row'}
      alignItems={'center'}
      justifyContent={'center'}
      columnGap={0.5}
    >
      <CircularIcon src={genericImg(src)} size={size} />
      <Typography whiteSpace={'nowrap'}>{value}</Typography>
    </Stack>
  );
};
