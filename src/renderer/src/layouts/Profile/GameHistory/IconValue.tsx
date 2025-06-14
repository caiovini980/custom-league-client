import { Stack, Typography } from '@mui/material';

interface IconValueProps {
  inverter?: boolean;
  src: string;
  value: string | number;
  size?: number;
}

export const IconValue = ({
  inverter,
  size = 20,
  src,
  value,
}: IconValueProps) => {
  return (
    <Stack
      direction={inverter ? 'row-reverse' : 'row'}
      alignItems={'center'}
      justifyContent={'center'}
      columnGap={0.5}
    >
      <img src={src} alt={''} height={size} width={size} />
      <Typography whiteSpace={'nowrap'}>{value}</Typography>
    </Stack>
  );
};
