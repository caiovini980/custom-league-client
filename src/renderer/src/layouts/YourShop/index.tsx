import { Box, ButtonBase, Paper, Stack, Typography } from '@mui/material';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import { useRef, useState } from 'react';
import { LolYourShopV1Status } from '@shared/typings/lol/response/lolYourShopV1Status';
import {
  buildEventUrl,
  useLeagueClientEvent,
} from '@render/hooks/useLeagueClientEvent';
import { LolYourShopV1Offers } from '@shared/typings/lol/response/lolYourShopV1Offers';
import { useLeagueClientRequest } from '@render/hooks/useLeagueClientRequest';
import { useLeagueImage } from '@render/hooks/useLeagueImage';
import { parseISO } from 'date-fns';
import { OfferModal, OfferModalRef } from '@render/layouts/YourShop/OfferModal';

export const YourShop = () => {
  const { loadChampionBackgroundImg } = useLeagueImage();
  const { rcpFeLolYourshop } = useLeagueTranslate();
  const { makeRequest } = useLeagueClientRequest();

  const rcpFeLolYourshopTrans = rcpFeLolYourshop('trans');

  const offerModalRef = useRef<OfferModalRef>(null);
  const [yourShopStatus, setYourShopStatus] = useState<LolYourShopV1Status>();
  const [yourShopOffers, setYourShopOffers] = useState<LolYourShopV1Offers[]>(
    [],
  );

  useLeagueClientEvent('/lol-yourshop/v1/status', (data) => {
    setYourShopStatus(data);
  });

  useLeagueClientEvent('/lol-yourshop/v1/offers', (data) => {
    setYourShopOffers(data);
  });

  const onClickOffer = (offer: LolYourShopV1Offers) => {
    if (!offer.revealed) {
      makeRequest(
        'POST',
        buildEventUrl('/lol-yourshop/v1/offers/{digits}/reveal', offer.id),
        undefined,
      ).then();
      return;
    }
    offerModalRef.current?.open(offer);
    /*
    return makeRequest(
      'POST',
      buildEventUrl('/lol-yourshop/v1/offers/{digits}/purchase', offer.id),
      undefined,
    ).then();

     */
  };

  const getDate = () => {
    if (!yourShopStatus) return '';
    return parseISO(yourShopStatus.endTime).toLocaleString();
  };

  return (
    <Stack
      direction={'column'}
      justifyContent={'space-between'}
      alignItems={'center'}
      width={'100%'}
      p={2}
    >
      <Typography textAlign={'center'}>
        {rcpFeLolYourshopTrans('yourshop_title')}
      </Typography>
      <Stack
        direction={'row'}
        width={'100%'}
        flex={1}
        alignItems={'center'}
        justifyContent={'space-between'}
        sx={{
          perspective: '1000px',
        }}
      >
        {yourShopOffers.map((offer) => {
          return (
            <Paper
              key={offer.id}
              sx={{
                position: 'relative',
                width: 180,
                minHeight: 320,
                height: '40%',
                transition: 'transform 0.6s',
                transformStyle: 'preserve-3d',
                transform: offer.revealed ? 'rotateY(540deg)' : 'rotateY(0deg)',
                '& > button': {
                  backfaceVisibility: 'hidden',
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  color: 'var(--mui-palette-common-white)',
                },
              }}
            >
              <Stack
                component={ButtonBase}
                onClick={() => onClickOffer(offer)}
                direction={'column'}
                rowGap={1}
                alignItems={'center'}
                justifyContent={'flex-end'}
                p={1}
                sx={{
                  transform: 'rotateY(180deg)',
                  background: `url(${loadChampionBackgroundImg('splashPath', offer.championId, offer.skinId)})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <Typography>{offer.skinName}</Typography>
                <Typography
                  fontSize={'0.8rem'}
                  sx={{ textDecoration: 'line-through' }}
                >
                  {rcpFeLolYourshopTrans(
                    'yourshop_original_price_rp',
                    offer.originalPrice,
                  )}
                </Typography>
                <Typography color={'#fff342'}>
                  {rcpFeLolYourshopTrans(
                    'yourshop_original_price_rp',
                    offer.discountPrice,
                  )}
                </Typography>
              </Stack>
              <Box component={ButtonBase} onClick={() => onClickOffer(offer)} />
            </Paper>
          );
        })}
      </Stack>
      <Typography>
        {rcpFeLolYourshopTrans(
          'yourshop_tencent_end_date_countdown',
          getDate(),
        )}
      </Typography>
      <OfferModal ref={offerModalRef} />
    </Stack>
  );
};
