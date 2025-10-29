import { Stack } from '@mui/material';
import { CustomTextField } from '@render/components/input';
import { useLeagueImage } from '@render/hooks/useLeagueImage';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import { BackgroundList } from '@render/layouts/Profile/RankedStats/SummonerEdit/BackgroundChange/BackgroundList';
import { currentSummonerStore } from '@render/zustand/stores/currentSummonerStore';
import { useMemo, useState } from 'react';
import { Virtuoso } from 'react-virtuoso';

interface BackgroundData {
  id: number;
  imgUrl: string;
  name: string;
}

export const SummonerBackgroundChange = () => {
  const { lolGameDataImg } = useLeagueImage();
  const { rcpFeLolSkinsPicker } = useLeagueTranslate();

  const { rcpFeLolSkinsPickerTrans } = rcpFeLolSkinsPicker;

  const skins = currentSummonerStore.skins.use();

  const [search, setSearch] = useState('');

  const skinList = useMemo(() => {
    const data: BackgroundData[][] = [];
    let temp: BackgroundData[] = [];
    const reg = new RegExp(`${search}`, 'ig');
    let lastChampionId = -1;
    skins.forEach((s) => {
      if (!s.name.match(reg)?.length) {
        return;
      }
      if (s.ownership.owned) {
        if (lastChampionId !== s.championId) {
          if (temp.length) data.push(temp);
          temp = [];
          lastChampionId = s.championId;
        }
        temp.push({
          id: s.id,
          name: s.name,
          imgUrl: lolGameDataImg(s.splashPath),
        });
      }
    });
    data.push(temp);
    return data;
  }, [skins, search]);

  return (
    <Stack direction={'column'} p={1} height={'100%'} rowGap={2}>
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
        data={skinList}
        overscan={5}
        itemContent={(_, data) => <BackgroundList list={data} />}
      />
    </Stack>
  );
};
