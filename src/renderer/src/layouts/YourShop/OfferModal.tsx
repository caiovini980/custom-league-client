import { Box, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { CircularIcon } from '@render/components/CircularIcon';
import CustomDialog, {
  CustomDialogCloseFloatingButton,
} from '@render/components/CustomDialog';
import { CustomButton } from '@render/components/input';
import { buildEventUrl } from '@render/hooks/useLeagueClientEvent';
import { useLeagueClientRequest } from '@render/hooks/useLeagueClientRequest';
import { useLeagueImage } from '@render/hooks/useLeagueImage';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import { currentSummonerStore } from '@render/zustand/stores/currentSummonerStore';
import { leagueClientStore } from '@render/zustand/stores/leagueClientStore';
import { LolYourShopV1Offers } from '@shared/typings/lol/response/lolYourShopV1Offers';
import { forwardRef, useImperativeHandle, useState } from 'react';

export interface OfferModalRef {
  open: (offer: LolYourShopV1Offers) => void;
}

export const OfferModal = forwardRef<OfferModalRef>((_, ref) => {
  const { loadChampionBackgroundImg, genericImg } = useLeagueImage();
  const { rcpFeLolYourshop } = useLeagueTranslate();
  const { makeRequest } = useLeagueClientRequest();

  const champions = currentSummonerStore.champions.use();
  const wallet = leagueClientStore.wallet.use();

  const { rcpFeLolYourshopTrans } = rcpFeLolYourshop;

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [offer, setOffer] = useState<LolYourShopV1Offers>();

  useImperativeHandle(ref, () => {
    return {
      open: (offer) => {
        setOffer(offer);
        setOpen(true);
      },
    };
  });

  if (!offer) return null;

  const onClickPurchase = () => {
    setLoading(true);
    makeRequest(
      'POST',
      buildEventUrl('/lol-yourshop/v1/offers/{digits}/purchase', offer.id),
      undefined,
    )
      .then((res) => {
        if (res.ok) {
          setOpen(false);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getSkinData = () => {
    const skin = champions
      .find((c) => c.id === offer.championId)
      ?.skins?.find((s) => s.id === offer.skinId);
    if (!skin) {
      throw new Error('Skin not found');
    }
    return skin;
  };
  getSkinData();

  const rpLeft = wallet.rp - offer.discountPrice;

  return (
    <CustomDialog
      maxWidth={'md'}
      fullWidth
      loading={loading}
      open={open}
      dialogContentProps={{
        sx: {
          height: 500,
          background: `url(${loadChampionBackgroundImg('uncenteredSplashPath', offer.championId, offer.skinId)})`,
          backgroundSize: 'cover',
          display: 'flex',
          alignItems: 'flex-end',
          p: 0,
        },
      }}
      actionsComponent={<div />}
    >
      <CustomDialogCloseFloatingButton
        colorScheme={'light'}
        handleClose={() => setOpen(false)}
      />
      <Box
        width={'100%'}
        height={180}
        pt={2}
        sx={{
          background: (t) =>
            `linear-gradient(0deg, ${alpha(t.palette.common.black, 0.75)} 80%, rgba(0,0,0,0) 100%)`,
        }}
      >
        <Stack
          direction={'column'}
          alignItems={'center'}
          justifyContent={'flex-start'}
          height={'100%'}
          rowGap={1}
          sx={{
            p: 2,
          }}
        >
          <Typography variant={'h4'} color={'var(--mui-palette-common-white)'}>
            {offer.skinName}
          </Typography>
          <CustomButton
            variant={'outlined'}
            color={'highlight'}
            onClick={onClickPurchase}
            disabled={rpLeft < 0}
            startIcon={
              <CircularIcon
                src={genericImg(
                  'plugins/rcp-fe-lol-static-assets/global/default/icon-rp-24.png',
                )}
                size={20}
              />
            }
          >
            {offer.discountPrice}
          </CustomButton>
          {rpLeft < 0 ? (
            <Typography color={'error'} fontSize={'0.8rem'}>
              {rcpFeLolYourshopTrans('yourshop_not_enough_rp')}
            </Typography>
          ) : (
            <Typography color={'textSecondary'} fontSize={'0.8rem'}>
              {rcpFeLolYourshopTrans('yourshop_details_new_balance_rp', rpLeft)}
            </Typography>
          )}
        </Stack>
      </Box>
    </CustomDialog>
  );
});
