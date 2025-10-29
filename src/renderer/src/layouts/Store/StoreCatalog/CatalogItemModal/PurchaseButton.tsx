import { Stack, Typography } from '@mui/material';
import { CustomButton } from '@render/components/input';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import { ItemIconValue } from '@render/layouts/Store/StoreCatalog/ItemIconValue';
import { leagueClientStore } from '@render/zustand/stores/leagueClientStore';
import { LolPurchaseWidgetV1PurchasableItem } from '@shared/typings/lol/response/lolPurchaseWidgetV1PurchasableItem';

interface PurchaseButtonProps {
  onClick: () => void;
  priceDetails: LolPurchaseWidgetV1PurchasableItem['purchaseOptions'][number]['priceDetails'];
}

export const PurchaseButton = ({
  onClick,
  priceDetails,
}: PurchaseButtonProps) => {
  const { rcpFeLolPaw } = useLeagueTranslate();

  const { rcpFeLolPawTrans } = rcpFeLolPaw;

  const wallet = leagueClientStore.wallet.use();

  const prices = {
    rp: 0,
    ip: 0,
  };

  priceDetails.forEach((pd) => {
    if (pd.price.currencyType === 'RP') {
      prices.rp += pd.price.price;
    }
    if (pd.price.currencyType === 'IP') {
      prices.ip += pd.price.price;
    }
  });

  const disabled = () => {
    return prices.rp > wallet.rp || prices.ip > wallet.blueEssence;
  };

  const newBalance = (type: 'IP' | 'RP', price: number) => {
    if (disabled()) return null;
    return (
      <Stack direction={'column'}>
        <Typography fontSize={'0.8rem'}>
          {rcpFeLolPawTrans('cat_paw_modal_new_balance')}
        </Typography>
        <ItemIconValue type={type} value={price} />
      </Stack>
    );
  };

  return (
    <Stack direction={'column'} rowGap={1} alignItems={'center'}>
      <CustomButton
        variant={'outlined'}
        onClick={onClick}
        disabled={disabled()}
        sx={{
          height: 32,
        }}
      >
        <Stack
          direction={'row'}
          columnGap={1}
          divider={<Typography>+</Typography>}
        >
          {!!prices.rp && <ItemIconValue type={'RP'} value={prices.rp} />}
          {!!prices.ip && <ItemIconValue type={'IP'} value={prices.ip} />}
        </Stack>
      </CustomButton>
      {!!prices.rp && newBalance('RP', wallet.rp - prices.rp)}
      {!!prices.ip && newBalance('IP', wallet.blueEssence - prices.ip)}
    </Stack>
  );
};
