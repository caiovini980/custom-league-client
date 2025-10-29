import { Divider, Stack } from '@mui/material';
import { LoadingScreen } from '@render/components/LoadingScreen';
import { CatalogFilter } from '@render/layouts/Store/StoreCatalog/CatalogFilter';
import { CatalogItem } from '@render/layouts/Store/StoreCatalog/CatalogItem';
import {
  CatalogItemModal,
  CatalogItemModalRef,
} from '@render/layouts/Store/StoreCatalog/CatalogItemModal';
import { useStoreCatalog } from '@render/layouts/Store/useStoreCatalog';
import { storeStore } from '@render/zustand/stores/storeStore';
import { StoreView } from '@shared/typings/ipc-function/handle/store.typing';
import { differenceInSeconds, parseISO } from 'date-fns';
import { orderBy } from 'lodash-es';
import { forwardRef, useEffect, useRef, useState } from 'react';
import { GridComponents, VirtuosoGrid } from 'react-virtuoso';

interface StoreCatalogProps {
  view: StoreView;
}

export const StoreCatalog = ({ view }: StoreCatalogProps) => {
  const { loadCatalog, loading } = useStoreCatalog();

  const data = storeStore.data.use((d) => {
    const item = d[view];
    return (item?.catalog ?? []).filter((c) => {
      if (
        view === 'skins' &&
        (c.inventoryType !== 'CHAMPION_SKIN' || c.subInventoryType)
      ) {
        return false;
      }
      if (view === 'chromas' && c.subInventoryType !== 'RECOLOR') {
        return false;
      }
      if (view === 'icons') {
        return ['ICON_BUNDLES', 'SUMMONER_ICON'].includes(c.inventoryType);
      }
      if (view === 'emotes' && c.inventoryType !== 'EMOTE') {
        return false;
      }
      if (view === 'tickets' && c.maxQuantity === -1) {
        return false;
      }
      return true;
    });
  });

  const modalRef = useRef<CatalogItemModalRef>(null);

  const [search, setSearch] = useState('');

  useEffect(() => {
    loadCatalog(view);
  }, [view]);

  const filtered = data
    .filter((d) => !d.owned)
    .filter((d) =>
      d.inactiveDate
        ? differenceInSeconds(parseISO(d.inactiveDate), new Date()) > 1
        : true,
    )
    .filter((d) => d.name.toLowerCase().includes(search.toLowerCase()));
  const ordered = orderBy(
    filtered,
    ['sale.endDate', 'inactiveDate', 'name'],
    ['asc', 'asc', 'asc'],
  );

  const handleClickItem = (inventoryType: string, itemId: number) => {
    modalRef.current?.open(inventoryType, itemId);
  };

  return (
    <Stack
      direction={'row'}
      width={'100%'}
      height={'100%'}
      position={'relative'}
      overflow={'auto'}
    >
      <LoadingScreen loading={loading} fullArea backdrop />
      <CatalogFilter view={view} onChangeSearch={setSearch} />
      <Divider flexItem orientation={'vertical'} />
      <VirtuosoGrid
        style={{ height: '100%', width: '100%' }}
        components={gridComponents}
        data={ordered}
        itemContent={(_, data) => (
          <CatalogItem item={data} onClick={handleClickItem} />
        )}
      />
      <CatalogItemModal ref={modalRef} />
    </Stack>
  );
};

const gridComponents: GridComponents = {
  List: forwardRef(({ style, children, ...props }, ref) => (
    <div
      ref={ref}
      {...props}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        ...style,
      }}
    >
      {children}
    </div>
  )),
  Item: ({ children, ...props }) => (
    <div
      {...props}
      style={{
        padding: '0.5rem',
        width: '100%',
        height: 280,
        display: 'flex',
        boxSizing: 'border-box',
      }}
    >
      {children}
    </div>
  ),
};
