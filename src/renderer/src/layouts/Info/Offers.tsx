import { Box, Grid, GridProps, Stack, Typography } from '@mui/material';
import { useLeagueClientRequest } from '@render/hooks/useLeagueClientRequest';
import { Children, PropsWithChildren, useEffect, useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import {
  buildEventUrl,
  useLeagueClientEvent,
} from '@render/hooks/useLeagueClientEvent';
import { LoadingScreen } from '@render/components/LoadingScreen';
import { CentralizedStack } from '@render/components/CentralizedStack';
import { LolStoreV1Catalog_InventoryType } from '@shared/typings/lol/response/lolStoreV1Catalog_InventoryType';
import { gameDataStore } from '@render/zustand/stores/gameDataStore';
import { useLeagueImage } from '@render/hooks/useLeagueImage';
import { alpha } from '@mui/material/styles';
import { CircularIcon } from '@render/components/CircularIcon';

export const Offers = (props: GridProps) => {
  const { makeRequest } = useLeagueClientRequest();
  const { lolGameDataImg } = useLeagueImage();

  const champions = gameDataStore.champions.use();

  const [storeReady, setStoreReady] = useState(false);
  const [championSales, setChampionSales] = useState<
    LolStoreV1Catalog_InventoryType[]
  >([]);
  const [championSkinSales, setChampionSkinSales] = useState<
    LolStoreV1Catalog_InventoryType[]
  >([]);

  const getChampionData = (championId: number) => {
    return champions.find((c) => c.id === championId);
  };

  const getSkinData = (skinId: number) => {
    return champions.flatMap((c) => c.skins).find((s) => s.id === skinId);
  };

  const getPrice = (saleData: LolStoreV1Catalog_InventoryType) => {
    const prices: {
      currency: 'RP';
      price: number;
      discount: number;
      priceWithDiscount: number;
    }[] = [];
    const currentRpPrice = saleData.prices.find((p) => p.currency === 'RP');
    const discountRpPrice = saleData.sale?.prices.find(
      (p) => p.currency === 'RP',
    );

    if (currentRpPrice) {
      prices.push({
        currency: 'RP',
        price: currentRpPrice.cost,
        discount: discountRpPrice?.discount ?? 0,
        priceWithDiscount: discountRpPrice?.cost ?? currentRpPrice.cost,
      });
    }

    return prices;
  };

  const loadSales = async () => {
    const sales = await makeRequest(
      'GET',
      '/lol-store/v1/catalog/sales',
      undefined,
    );
    if (!sales.ok) return;

    const championSales = sales.body
      .filter((s) => s.item.inventoryType === 'CHAMPION')
      .map((s) => s.item.itemId);
    const championSkinSales = sales.body
      .filter((s) => s.item.inventoryType === 'CHAMPION_SKIN')
      .map((s) => s.item.itemId);
    makeRequest(
      'GET',
      buildEventUrl(
        '/lol-store/v1/catalog/{string}?itemIds={string}',
        'CHAMPION',
        JSON.stringify(championSales),
      ),
      undefined,
    ).then((data) => {
      if (data.ok) {
        setChampionSales(data.body);
      }
    });
    makeRequest(
      'GET',
      buildEventUrl(
        '/lol-store/v1/catalog/{string}?itemIds={string}',
        'CHAMPION_SKIN',
        JSON.stringify(championSkinSales),
      ),
      undefined,
    ).then((data) => {
      if (data.ok) {
        setChampionSkinSales(data.body);
      }
    });
  };

  useLeagueClientEvent('/lol-store/v1/store-ready', (data) => {
    setStoreReady(data);
  });

  useEffect(() => {
    if (!storeReady) return;
    loadSales();
  }, [storeReady]);

  if (!storeReady) {
    return (
      <CentralizedStack>
        <LoadingScreen />
      </CentralizedStack>
    );
  }

  return (
    <>
      <Grid {...props}>
        <CustomCarousel>
          {championSkinSales.map((skin) => {
            const skinData = getSkinData(skin.itemId);
            const prices = getPrice(skin);

            if (!skinData) return <div />;

            return (
              <SaleCard
                key={skin.itemId}
                title={skinData.name}
                imgUrl={lolGameDataImg(skinData.splashPath)}
                prices={prices}
              />
            );
          })}
        </CustomCarousel>
      </Grid>
      <Grid {...props}>
        <CustomCarousel>
          {championSales.map((champion) => {
            const championData = getChampionData(champion.itemId);
            const prices = getPrice(champion);

            if (!championData) return <div />;

            return (
              <SaleCard
                key={champion.itemId}
                title={championData.name}
                imgUrl={lolGameDataImg(championData.skins[0].splashPath)}
                prices={prices}
              />
            );
          })}
        </CustomCarousel>
      </Grid>
    </>
  );
};

const CustomCarousel = ({ children }: PropsWithChildren) => {
  return (
    <Box
      height={'100%'}
      flexShrink={0}
      width={'100%'}
      position={'relative'}
      sx={{
        '& .slider, .slide, .carousel-root, .carousel-slider, .slider-wrapper':
          {
            height: '100%',
          },
      }}
    >
      <Carousel
        key={Children.count(children)}
        autoPlay
        infiniteLoop
        showStatus={false}
        showThumbs={false}
        swipeable={false}
        stopOnHover
      >
        {/*@ts-ignore*/}
        {children}
      </Carousel>
    </Box>
  );
};

interface SaleCardProps {
  imgUrl: string;
  title: string;
  prices: {
    currency: 'RP';
    price: number;
    discount: number;
    priceWithDiscount: number;
  }[];
}

const SaleCard = ({ title, imgUrl, prices }: SaleCardProps) => {
  const { genericImg } = useLeagueImage();

  return (
    <Stack
      className={'theme-dark'}
      direction={'column'}
      justifyContent={'flex-end'}
      height={'100%'}
      sx={{
        background: `url(${imgUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Stack
        direction={'column'}
        sx={{
          p: 1,
          pb: '35px',
          background: (t) => alpha(t.palette.common.black, 0.7),
        }}
      >
        <Typography color={'textPrimary'} fontSize={'1.2rem'}>
          {title}
        </Typography>
        <Stack direction={'row'} columnGap={1} justifyContent={'center'}>
          {prices.map((p, i) => (
            <Stack
              key={i}
              direction={'row'}
              columnGap={1}
              justifyContent={'center'}
              border={'1px solid var(--mui-palette-divider)'}
              p={1}
            >
              <Stack
                direction={'column'}
                alignItems={'center'}
                justifyContent={'center'}
              >
                <CircularIcon
                  src={genericImg(
                    'plugins/rcp-fe-lol-static-assets/global/default/icon-rp-24.png',
                  )}
                  size={16}
                />
                <Typography color={'textPrimary'} fontSize={'0.75rem'}>
                  {Math.floor(p.discount * 100)}%
                </Typography>
              </Stack>
              <Stack direction={'column'}>
                <Typography fontSize={'1.2rem'} color={'highlight'}>
                  {p.priceWithDiscount}
                </Typography>
                <Typography fontSize={'0.65rem'} color={'textDisabled'}>
                  {p.price}
                </Typography>
              </Stack>
            </Stack>
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
};
