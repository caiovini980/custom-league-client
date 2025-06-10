import { LolYourShopV1Offers } from '@shared/typings/lol/response/lolYourShopV1Offers';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { Stack, Typography } from '@mui/material';
import CustomDialog from '@render/components/CustomDialog';
import { useLeagueImage } from '@render/hooks/useLeagueImage';
import { CustomIconButton } from '@render/components/input';
import { FaTimes } from 'react-icons/fa';
import { alpha } from '@mui/material/styles';

export interface OfferModalRef {
  open: (offer: LolYourShopV1Offers) => void;
}

export const OfferModal = forwardRef<OfferModalRef>((_, ref) => {
  const { loadChampionBackgroundImg } = useLeagueImage();

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

  return (
    <CustomDialog
      maxWidth={'md'}
      fullWidth
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
      <CustomIconButton
        onClick={() => setOpen(false)}
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
        }}
      >
        <FaTimes />
      </CustomIconButton>
      <Stack
        direction={'column'}
        alignItems={'center'}
        justifyContent={'flex-start'}
        width={'100%'}
        height={180}
        sx={{
          p: 2,
          pt: 3,
          background: (t) =>
            `linear-gradient(0deg, ${alpha(t.palette.background.default, 0.9)} 80%, rgba(0,0,0,0) 100%)`,
        }}
      >
        <Typography variant={'h4'}>{offer.skinName}</Typography>
      </Stack>
    </CustomDialog>
  );
});
