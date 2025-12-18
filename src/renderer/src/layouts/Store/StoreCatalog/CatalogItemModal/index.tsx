import { Box, Divider, Stack, Typography } from '@mui/material';
import CustomDialog, {
  CustomDialogCloseFloatingButton,
} from '@render/components/CustomDialog';
import { DiscountLabel } from '@render/components/League/DiscountLabel';
import { buildEventUrl } from '@render/hooks/useLeagueClientEvent';
import { useLeagueClientRequest } from '@render/hooks/useLeagueClientRequest';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import { useSnackNotification } from '@render/hooks/useSnackNotification';
import { DependencyItems } from '@render/layouts/Store/StoreCatalog/CatalogItemModal/DependencyItems';
import { PurchaseButton } from '@render/layouts/Store/StoreCatalog/CatalogItemModal/PurchaseButton';
import { ValidationError } from '@render/layouts/Store/StoreCatalog/CatalogItemModal/ValidationError';
import { useStoreCatalog } from '@render/layouts/Store/useStoreCatalog';
import { LolPurchaseWidgetV1PurchasableItem } from '@shared/typings/lol/response/lolPurchaseWidgetV1PurchasableItem';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';

export interface CatalogItemModalRef {
  open: (inventoryType: string, itemId: number) => void;
}

export const CatalogItemModal = forwardRef<CatalogItemModalRef>((_, ref) => {
  const { makeRequest } = useLeagueClientRequest();
  const { snackSuccess, snackError } = useSnackNotification();
  const { rcpFeLolPaw } = useLeagueTranslate();
  const { reloadCurrentCatalog, getItemImg } = useStoreCatalog();

  const { rcpFeLolPawTrans } = rcpFeLolPaw;

  const [item, setItem] = useState<LolPurchaseWidgetV1PurchasableItem>();
  const [loading, setLoading] = useState(false);
  const [modalData, setModalData] = useState({
    open: false,
    inventoryType: '',
    itemId: -1,
  });

  const handleClose = () => {
    setModalData((prev) => ({
      ...prev,
      open: false,
    }));
  };

  const handleClickBuy = (
    priceDetails: LolPurchaseWidgetV1PurchasableItem['purchaseOptions'][number]['priceDetails'],
  ) => {
    if (!item) return;
    setLoading(true);
    makeRequest('POST', '/lol-purchase-widget/v2/purchaseItems', {
      items: priceDetails.map((pd) => ({
        itemKey: pd.itemKey,
        purchaseCurrencyInfo: pd.price,
        source: 'svuPaw',
        quantity: 1,
        featuredSection: '',
      })),
    }).then((res) => {
      setLoading(false);
      if (res.ok) {
        snackSuccess(
          rcpFeLolPawTrans('cat_paw_unlock_message', item.item.name),
        );
        handleClose();
        reloadCurrentCatalog();
      } else {
        snackError(rcpFeLolPawTrans('cat_paw_error_generic'));
      }
    });
  };

  const getDescription = () => {
    if (!item) return '';
    if (item.item.description) return item.item.description;
    if (item.item.inventoryType === 'CHAMPION_SKIN') {
      if (item.item.subInventoryType === 'RECOLOR') {
        return rcpFeLolPawTrans('cat_paw_subtitle_champion_skin_recolor');
      }
      return rcpFeLolPawTrans('cat_paw_subtitle_champion_skin');
    }
    if (item.item.inventoryType === 'CHAMPION') {
      return rcpFeLolPawTrans('cat_paw_subtitle_champion');
    }
    return '';
  };

  const backgroundSize = () => {
    if (!item) return '';
    const { subInventoryType, inventoryType } = item.item;
    if (subInventoryType) {
      return '50%, cover';
    }
    if (['WARD_SKIN', 'SUMMONER_ICON', 'EMOTE'].includes(inventoryType)) {
      return '30%, cover';
    }
    return 'cover';
  };

  useImperativeHandle(ref, () => {
    return {
      open: (inventoryType, itemId) => {
        setModalData({
          open: true,
          inventoryType,
          itemId,
        });
      },
    };
  }, []);

  useEffect(() => {
    if (modalData.itemId !== -1 && modalData.inventoryType) {
      setLoading(true);
      makeRequest(
        'GET',
        buildEventUrl(
          '/lol-purchase-widget/v1/purchasable-item?inventoryType={string}&itemId={number}',
          modalData.inventoryType,
          modalData.itemId,
        ),
        undefined,
      ).then((res) => {
        setLoading(false);
        if (res.ok) {
          setItem(res.body);
        } else {
          snackError(
            rcpFeLolPawTrans('cat_paw_error_purchase_internal_fail_title'),
          );
          handleClose();
        }
      });
    }
  }, [modalData.itemId, modalData.inventoryType]);

  return (
    <CustomDialog
      open={modalData.open}
      fullWidth
      maxWidth={'sm'}
      actionsComponent={<div />}
      loading={loading}
      dialogContentProps={{
        sx: {
          display: 'flex',
          flexDirection: 'column',
          p: 0,
          justifyContent: 'flex-end',
          alignItems: 'center',
          position: 'relative',
          background: 'var(--mui-palette-background-paper)',
        },
      }}
    >
      <CustomDialogCloseFloatingButton handleClose={handleClose} />
      {item && (
        <>
          <ValidationError validations={item.validationErrors} />
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: 300,
              width: '100%',
              background:
                modalData.inventoryType === 'CURRENCY'
                  ? `url(${item.item.imagePath})`
                  : getItemImg(modalData.inventoryType, modalData.itemId),
              backgroundSize: backgroundSize(),
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              maskImage:
                'linear-gradient(to bottom, rgba(0,0,0,1) 80%, rgba(0,0,0,0) 100%)',
            }}
          />
          <Stack
            direction={'column'}
            width={'100%'}
            rowGap={1}
            p={3}
            mt={-2}
            alignItems={'center'}
            zIndex={1}
          >
            <Typography fontSize={'1.6rem'} lineHeight={0.5}>
              {item.item.name}
            </Typography>
            <Typography fontSize={'0.8rem'}>{getDescription()}</Typography>
            <DependencyItems dependencies={item.dependencies} />
            <Divider flexItem />
            {item.sale && (
              <DiscountLabel value={Math.floor(item.sale.discount)} />
            )}
            <Stack direction={'row'} justifyContent={'center'} columnGap={3}>
              {item.purchaseOptions.map((pr, index) => (
                <PurchaseButton
                  key={index}
                  priceDetails={pr.priceDetails}
                  onClick={() => handleClickBuy(pr.priceDetails)}
                />
              ))}
            </Stack>
          </Stack>
        </>
      )}
    </CustomDialog>
  );
});
