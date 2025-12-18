import { Grid, GridProps } from '@mui/material';
import { CustomCarousel } from '@render/components/CustomCarousel';
import { LoadingScreen } from '@render/components/LoadingScreen';
import { withSystemReady } from '@render/hoc/withSystemReady';
import { buildEventUrl } from '@render/hooks/useLeagueClientEvent';
import { useLeagueClientRequest } from '@render/hooks/useLeagueClientRequest';
import { useLeagueImage } from '@render/hooks/useLeagueImage';
import { SaleCard } from '@render/layouts/CenterHub/Offers/SalesCard';
import {
  CatalogItemModal,
  CatalogItemModalRef,
} from '@render/layouts/Store/StoreCatalog/CatalogItemModal';
import { centerHubStore } from '@render/zustand/stores/centerHubStore';
import { currentSummonerStore } from '@render/zustand/stores/currentSummonerStore';
import { gameDataStore } from '@render/zustand/stores/gameDataStore';
import { LolStoreV1Catalog_InventoryType } from '@shared/typings/lol/response/lolStoreV1Catalog_InventoryType';
import { PropsWithChildren, useEffect, useRef } from 'react';

export const Offers = withSystemReady('store', (props: GridProps) => {
  const { makeRequest } = useLeagueClientRequest();
  const { lolGameDataImg } = useLeagueImage();

  const catalogRef = useRef<CatalogItemModalRef>(null);

  const champions = gameDataStore.champions.use();

  const championSales = centerHubStore.sales.champions.use();
  const championSkinSales = centerHubStore.sales.skins.use();
  const summonerChampions = currentSummonerStore.champions.use();
  const summonerChampionSkins = currentSummonerStore.skins.use();

  const getChampionData = (championId: number) => {
    return champions.find((c) => c.id === championId);
  };

  const getSkinData = (skinId: number) => {
    return champions.flatMap((c) => c.skins).find((s) => s.id === skinId);
  };

  const isAlreadyEnabledChampion = (championId: number) => {
    return summonerChampions.some(
      (c) => c.ownership.owned && c.id === championId,
    );
  };

  const isAlreadyEnabledChampionSkin = (skinId: number) => {
    return summonerChampionSkins.some(
      (skin) => skin.id === skinId && skin.ownership.owned,
    );
  };

  const getPrice = (saleData: LolStoreV1Catalog_InventoryType) => {
    const prices: {
      currency: 'RP' | 'IP';
      price: number;
      discount: number;
      priceWithDiscount: number;
    }[] = [];
    ['RP', 'IP'].forEach((currency) => {
      const currentRpPrice = saleData.prices.find(
        (p) => p.currency === currency,
      );
      const discountRpPrice = saleData.sale?.prices.find(
        (p) => p.currency === currency,
      );

      if (currentRpPrice && discountRpPrice) {
        const priceWithDiscount = discountRpPrice.cost;
        prices.push({
          currency: currency as 'IP',
          price: currentRpPrice.cost,
          discount: 100 - (priceWithDiscount * 100) / currentRpPrice.cost,
          priceWithDiscount,
        });
      }
    });

    return prices;
  };

  const loadSales = async () => {
    const sales = await makeRequest(
      'GET',
      '/lol-store/v1/catalog/sales',
      undefined,
    );
    if (!sales.ok) return;
    const baseSkinIdList = champions.flatMap((c) => c.skins).map((c) => c.id);
    const championSales = sales.body
      .filter((s) => s.item.inventoryType === 'CHAMPION')
      .map((s) => s.item.itemId);
    const championSkinSales = sales.body
      .filter((s) => s.item.inventoryType === 'CHAMPION_SKIN')
      .map((s) => s.item.itemId)
      .filter((id) => baseSkinIdList.includes(id));
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
        centerHubStore.sales.champions.set(data.body);
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
        centerHubStore.sales.skins.set(data.body);
      }
    });
  };

  useEffect(() => {
    loadSales().then();
  }, []);

  return (
    <>
      <Grid position={'relative'} {...props}>
        <LoadingScreen loading={!championSkinSales.length} backdrop fullArea />
        <OfferCarousel>
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
                alreadyEnabled={isAlreadyEnabledChampionSkin(skin.itemId)}
                onClick={() =>
                  catalogRef.current?.open('CHAMPION_SKIN', skin.itemId)
                }
              />
            );
          })}
        </OfferCarousel>
      </Grid>
      <Grid position={'relative'} {...props}>
        <LoadingScreen loading={!championSales.length} backdrop fullArea />
        <OfferCarousel>
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
                onClick={() =>
                  catalogRef.current?.open('CHAMPION', champion.itemId)
                }
                alreadyEnabled={isAlreadyEnabledChampion(champion.itemId)}
              />
            );
          })}
        </OfferCarousel>
      </Grid>
      <CatalogItemModal ref={catalogRef} />
    </>
  );
});

const OfferCarousel = ({ children }: PropsWithChildren) => {
  return (
    <CustomCarousel infinite pauseOnHover slidesToShow={1} autoplay>
      {/*@ts-ignore*/}
      {children}
    </CustomCarousel>
  );
};
