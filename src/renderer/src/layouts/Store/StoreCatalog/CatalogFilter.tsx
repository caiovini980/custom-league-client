import { Stack } from '@mui/material';
import { CustomTextField } from '@render/components/input';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import { StoreView } from '@shared/typings/ipc-function/handle/store.typing';
import { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';

interface CatalogFilterProps {
  view: StoreView;
  onChangeSearch: (value: string) => void;
}

export const CatalogFilter = ({ view, onChangeSearch }: CatalogFilterProps) => {
  const { rcpFeLolLoot } = useLeagueTranslate();

  const { rcpFeLolLootTrans } = rcpFeLolLoot;

  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    setSearchValue('');
  }, [view]);

  useEffect(() => {
    onChangeSearch(searchValue);
  }, [searchValue]);

  return (
    <Stack direction={'row'} p={1} width={280}>
      <CustomTextField
        debounceTime={400}
        onChangeText={setSearchValue}
        value={searchValue}
        placeholder={rcpFeLolLootTrans(
          'loot_filter_searchbox_placeholder_text',
        )}
        startIcon={<FaSearch />}
      />
    </Stack>
  );
};
