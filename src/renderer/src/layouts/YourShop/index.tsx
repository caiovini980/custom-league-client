import { ButtonBase, Divider, Paper, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { withSystemReady } from '@render/hoc/withSystemReady';
import {
  buildEventUrl,
  useLeagueClientEvent,
} from '@render/hooks/useLeagueClientEvent';
import { useLeagueClientRequest } from '@render/hooks/useLeagueClientRequest';
import { useLeagueImage } from '@render/hooks/useLeagueImage';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import { OfferModal, OfferModalRef } from '@render/layouts/YourShop/OfferModal';
import { YourShopTimeLeft } from '@render/layouts/YourShop/YourShopTimeLeft';
import { LolYourShopV1Offers } from '@shared/typings/lol/response/lolYourShopV1Offers';
import { LolYourShopV1Status } from '@shared/typings/lol/response/lolYourShopV1Status';
import { parseISO } from 'date-fns';
import { useRef, useState } from 'react';

export const YourShop = withSystemReady('yourShop', () => {
  const { loadChampionBackgroundImg } = useLeagueImage();
  const { rcpFeLolYourshop } = useLeagueTranslate();
  const { makeRequest } = useLeagueClientRequest();

  const { rcpFeLolYourshopTrans } = rcpFeLolYourshop;

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
      rowGap={1.5}
    >
      <Typography textAlign={'center'} fontSize={'2rem'}>
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
              component={ButtonBase}
              onClick={() => onClickOffer(offer)}
              disabled={offer.owned}
              sx={{
                position: 'relative',
                width: 180,
                minHeight: 320,
                height: '40%',
                transition: 'transform 0.6s',
                transformStyle: 'preserve-3d',
                transform: offer.revealed ? 'rotateY(540deg)' : 'rotateY(0deg)',
                '& > div': {
                  backfaceVisibility: 'hidden',
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  color: 'var(--mui-palette-common-white)',
                },
              }}
            >
              <Stack
                direction={'column'}
                rowGap={0}
                alignItems={'center'}
                justifyContent={'flex-end'}
                p={1}
                sx={{
                  transform: 'rotateY(180deg)',
                  background: (t) =>
                    `linear-gradient(0deg, ${alpha(t.palette.common.black, 0.75)} 10%, rgba(0,0,0,0) 50%), url(${loadChampionBackgroundImg('splashPath', offer.championId, offer.skinId)})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <Typography>{offer.skinName}</Typography>
                {!offer.owned ? (
                  <>
                    <Divider flexItem>
                      <Typography
                        fontWeight={'bold'}
                        color={'highlight'}
                        fontSize={'0.8rem'}
                      >
                        -
                        {100 -
                          (offer.discountPrice * 100) / offer.originalPrice}
                        %
                      </Typography>
                    </Divider>
                    <Typography
                      color={'highlight'}
                      fontWeight={'bold'}
                      fontSize={'1.4rem'}
                    >
                      {rcpFeLolYourshopTrans(
                        'yourshop_original_price_rp',
                        offer.discountPrice,
                      )}
                    </Typography>
                    <Typography
                      fontSize={'0.7rem'}
                      color={'textDisabled'}
                      lineHeight={0.5}
                      sx={{ textDecoration: 'line-through' }}
                    >
                      {rcpFeLolYourshopTrans(
                        'yourshop_original_price_rp',
                        offer.originalPrice,
                      )}
                    </Typography>
                  </>
                ) : (
                  <Typography color={'highlight'}>
                    {rcpFeLolYourshopTrans('yourshop_owned')}
                  </Typography>
                )}
              </Stack>
            </Paper>
          );
        })}
      </Stack>
      <Typography fontSize={'1.2rem'} color={'highlight'}>
        {rcpFeLolYourshopTrans(
          'yourshop_tencent_end_date_countdown',
          getDate(),
        )}
      </Typography>
      <YourShopTimeLeft endDate={yourShopStatus?.endTime} />
      <Typography fontSize={'0.8rem'}>
        {rcpFeLolYourshopTrans('yourshop_general_includes_champ')}
      </Typography>
      <Divider flexItem />
      <Typography fontSize={'0.8rem'}>
        {rcpFeLolYourshopTrans('yourshop_reminder_notice')}
      </Typography>
      <OfferModal ref={offerModalRef} />
    </Stack>
  );
});
