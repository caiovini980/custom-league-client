import { Box, Typography } from '@mui/material';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import { LolPurchaseWidgetV1PurchasableItem } from '@shared/typings/lol/response/lolPurchaseWidgetV1PurchasableItem';

interface ValidationErrorProps {
  validations: LolPurchaseWidgetV1PurchasableItem['validationErrors'];
}

export const ValidationError = ({ validations }: ValidationErrorProps) => {
  const { rcpFeLolPaw } = useLeagueTranslate();

  const { rcpFeLolPawTrans } = rcpFeLolPaw;

  if (!validations.length) return null;

  const getFirstError = () => {
    return rcpFeLolPawTrans(
      `cat_paw_error_${validations[0].id.replaceAll('.', '_')}`,
    );
  };

  return (
    <Box
      position={'absolute'}
      top={4}
      left={0}
      right={0}
      zIndex={3}
      display={'flex'}
      justifyContent={'center'}
    >
      <Typography
        textAlign={'center'}
        fontSize={'0.8rem'}
        sx={{
          p: 0.5,
          px: 1,
          borderRadius: 4,
          background: 'var(--mui-palette-error-light)',
        }}
      >
        {getFirstError()}
      </Typography>
    </Box>
  );
};
