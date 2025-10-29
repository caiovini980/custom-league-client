import { Stack, Typography } from '@mui/material';
import { CircularIcon } from '@render/components/CircularIcon';
import { useLeagueImage } from '@render/hooks/useLeagueImage';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import { LolPurchaseWidgetV1PurchasableItem } from '@shared/typings/lol/response/lolPurchaseWidgetV1PurchasableItem';

interface DependencyItemsProps {
  dependencies: LolPurchaseWidgetV1PurchasableItem['dependencies'];
}

export const DependencyItems = ({ dependencies }: DependencyItemsProps) => {
  const { lolGameDataImg } = useLeagueImage();
  const { rcpFeLolPaw } = useLeagueTranslate();

  const { rcpFeLolPawTrans } = rcpFeLolPaw;

  const filtered = dependencies.filter((dp) => !dp.owned);

  if (!filtered.length) return null;

  const getText = (
    dp: LolPurchaseWidgetV1PurchasableItem['dependencies'][number],
  ) => {
    const suffix = dp.inventoryType === 'CHAMPION' ? 'champion' : 'skin';
    return rcpFeLolPawTrans(
      `cat_paw_skin_purchase_modal_price_include_${suffix}`,
    );
  };

  return (
    <Stack
      direction={'column'}
      rowGap={1}
      width={'100%'}
      borderTop={'1px solid var(--mui-palette-divider)'}
      alignItems={'center'}
      pt={1}
    >
      {filtered.map((dp) => (
        <Stack
          key={`${dp.inventoryType}:${dp.itemId}`}
          direction={'row'}
          alignItems={'center'}
          columnGap={1}
        >
          <CircularIcon src={lolGameDataImg(dp.assets.tilePath)} />
          <Typography>{getText(dp)}</Typography>
        </Stack>
      ))}
    </Stack>
  );
};
