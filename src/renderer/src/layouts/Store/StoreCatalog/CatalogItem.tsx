import { Box, ButtonBase, Paper, Stack, Typography } from '@mui/material';
import { Countdown } from '@render/components/Countdown';
import { DiscountLabel } from '@render/components/League/DiscountLabel';
import { ItemIconValue } from '@render/layouts/Store/StoreCatalog/ItemIconValue';
import { useStoreCatalog } from '@render/layouts/Store/useStoreCatalog';
import { StoreResponseCatalog } from '@shared/typings/ipc-function/handle/store.typing';

interface CatalogItemProps {
  item: StoreResponseCatalog;
  onClick: (inventoryType: string, itemId: number) => void;
}

export const CatalogItem = ({ item, onClick }: CatalogItemProps) => {
  const { getItemImg } = useStoreCatalog();

  if (!item) null;

  const backgroundSize = () => {
    if (item.subInventoryType) {
      return '70%, cover';
    }
    if (['WARD_SKIN', 'SUMMONER_ICON', 'EMOTE'].includes(item.inventoryType)) {
      return '40%, cover';
    }
    return 'cover';
  };

  return (
    <ButtonBase
      sx={{
        height: '100%',
        width: '100%',
      }}
      onClick={() => onClick(item.inventoryType, item.itemId)}
    >
      <Paper
        variant={'outlined'}
        sx={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          height: 'inherit',
          width: 'inherit',
          p: 0.5,
          zIndex: 2,
          '&::before': {
            content: "''",
            position: 'absolute',
            inset: 0,
            zIndex: -1,
            background:
              item.inventoryType === 'CURRENCY'
                ? `url(${item.iconUrl})`
                : getItemImg(item.inventoryType, item.itemId),
            backgroundSize: backgroundSize(),
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            maskImage:
              'linear-gradient(to bottom, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 100%)',
          },
        }}
      >
        {item.sale?.percentOff && (
          <Box position={'absolute'} top={4} left={4}>
            <DiscountLabel value={item.sale.percentOff} />
          </Box>
        )}
        {item.inactiveDate && (
          <Box
            position={'absolute'}
            top={4}
            right={4}
            sx={{
              borderRadius: 4,
              py: 0.5,
              px: 1,
              background: 'var(--mui-palette-background-paper)',
            }}
          >
            <Countdown endDate={item.inactiveDate} />
          </Box>
        )}
        <Typography textAlign={'center'}>{item.name}</Typography>
        <Stack
          direction={'row'}
          justifyContent={'space-evenly'}
          alignItems={'center'}
        >
          <ItemIconValue type={'RP'} value={item.rp} discount={item.sale?.rp} />
          {!!item.ip && <ItemIconValue type={'IP'} value={item.ip} />}
        </Stack>
      </Paper>
    </ButtonBase>
  );
};
