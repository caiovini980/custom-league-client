import { Stack } from '@mui/material';
import { CustomTextField } from '@render/components/input';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import { IconList } from '@render/layouts/Profile/RankedStats/SummonerEdit/IconChange/IconList';
import { currentSummonerStore } from '@render/zustand/stores/currentSummonerStore';
import { parseISO } from 'date-fns';
import { groupBy } from 'lodash-es';
import { useMemo, useState } from 'react';
import { Virtuoso } from 'react-virtuoso';

export const IconChange = () => {
  const { rcpFeLolSkinsPicker } = useLeagueTranslate();

  const { rcpFeLolSkinsPickerTrans } = rcpFeLolSkinsPicker;

  const summonerIcon = currentSummonerStore.icons.use();

  const [search, setSearch] = useState('');

  const [grouped, groupKeys] = useMemo(() => {
    const reg = new RegExp(`${search}`, 'ig');
    const filtered = summonerIcon.filter((si) => !!si.name.match(reg)?.length);
    const grouped = groupBy(filtered, (si) =>
      parseISO(si.purchaseDate).getFullYear(),
    );
    const groupKeys = Object.keys(grouped).reverse();

    return [grouped, groupKeys];
  }, [summonerIcon, search]);

  return (
    <Stack direction={'column'} height={'100%'} rowGap={2} p={1}>
      <CustomTextField
        value={search}
        onChangeText={setSearch}
        placeholder={rcpFeLolSkinsPickerTrans(
          'control_panel_search_placeholder',
        )}
        debounceTime={300}
      />
      <Virtuoso
        style={{ height: '100%' }}
        data={groupKeys}
        overscan={5}
        itemContent={(_, data) => <IconList year={data} list={grouped[data]} />}
      />
    </Stack>
  );
};
