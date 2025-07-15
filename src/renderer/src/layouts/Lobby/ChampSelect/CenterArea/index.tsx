import { Stack } from '@mui/material';
import { ActionButton } from '@render/layouts/Lobby/ChampSelect/CenterArea/ActionButton';
import { ChampionSelectList } from '@render/layouts/Lobby/ChampSelect/CenterArea/ChampionSelectList';
import { SubsetChampionPick } from '@render/layouts/Lobby/ChampSelect/CenterArea/SubsetChampionPick';
import { useChampSelectContext } from '@render/layouts/Lobby/ChampSelect/ChampSelectContext';
import { SkinSelector } from 'src/layouts/Lobby/ChampSelect/CenterArea/SkinSelector';

export const CenterArea = () => {
  const { session } = useChampSelectContext();

  return (
    <Stack
      width={'100%'}
      height={'100%'}
      direction={'column'}
      rowGap={1}
      justifyContent={'flex-end'}
      overflow={'auto'}
    >
      {session.allowSubsetChampionPicks ? (
        <SubsetChampionPick />
      ) : (
        <ChampionSelectList />
      )}
      <SkinSelector />
      <ActionButton />
    </Stack>
  );
};
