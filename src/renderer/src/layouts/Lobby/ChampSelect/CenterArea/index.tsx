import { Stack } from '@mui/material';
import { ActionButton } from '@render/layouts/Lobby/ChampSelect/CenterArea/ActionButton';
import { ChampionSelectList } from '@render/layouts/Lobby/ChampSelect/CenterArea/ChampionSelectList';
import { SubsetChampionPick } from '@render/layouts/Lobby/ChampSelect/CenterArea/SubsetChampionPick';
import { champSelectStore } from '@render/zustand/stores/champSelectStore';
import { SkinSelector } from 'src/layouts/Lobby/ChampSelect/CenterArea/SkinSelector';

export const CenterArea = () => {
  const allowSubsetChampionPicks = champSelectStore.getSessionData(
    (session) => session.allowSubsetChampionPicks,
  );

  return (
    <Stack
      width={'100%'}
      height={'100%'}
      direction={'column'}
      rowGap={1}
      justifyContent={'flex-end'}
      overflow={'auto'}
    >
      {allowSubsetChampionPicks ? (
        <SubsetChampionPick />
      ) : (
        <ChampionSelectList />
      )}
      <SkinSelector />
      <ActionButton />
    </Stack>
  );
};
