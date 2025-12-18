import { Box, Typography } from '@mui/material';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';

interface DiscountLabelProps {
  value: number;
}

export const DiscountLabel = ({ value }: DiscountLabelProps) => {
  const { rcpFeLolPaw } = useLeagueTranslate();

  return (
    <Box
      sx={{
        background: 'var(--mui-palette-error-main)',
        borderRadius: 4,
        px: 1,
        py: 0.3,
      }}
    >
      <Typography fontSize={'0.7rem'} fontWeight={'bold'}>
        {rcpFeLolPaw.rcpFeLolPawTrans('cat_paw_modal_sale_value', value)}
      </Typography>
    </Box>
  );
};
