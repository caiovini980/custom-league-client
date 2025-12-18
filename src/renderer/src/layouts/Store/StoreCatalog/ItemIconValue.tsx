import { Stack, Typography } from '@mui/material';
import { CircularIcon } from '@render/components/CircularIcon';
import { useLeagueImage } from '@render/hooks/useLeagueImage';
import { formatCurrency } from '@shared/utils/string.util';

interface ItemIconValueProps {
  type: 'IP' | 'RP';
  value: number;
  discount?: number;
}

export const ItemIconValue = ({
  type,
  value,
  discount,
}: ItemIconValueProps) => {
  const { genericImg } = useLeagueImage();

  const icon = () => {
    const src = type === 'RP' ? 'icon-rp-24.png' : 'icon-be-150.png';
    return genericImg(`plugins/rcp-fe-lol-static-assets/global/default/${src}`);
  };

  return (
    <Stack direction={'row'} alignItems={'center'} columnGap={0.5}>
      <CircularIcon src={icon()} size={18} />
      {!!discount && (
        <Typography fontSize={'1rem'} color={'highlight'}>
          {formatCurrency(discount, 0)}
        </Typography>
      )}
      <Typography
        fontSize={'0.8rem'}
        color={!discount ? 'textPrimary' : 'textDisabled'}
        sx={{
          textDecoration: !!discount ? 'line-through' : undefined,
        }}
      >
        {formatCurrency(value, 0)}
      </Typography>
    </Stack>
  );
};
