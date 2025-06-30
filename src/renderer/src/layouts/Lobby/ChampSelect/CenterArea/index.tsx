import { Stack } from '@mui/material';
import { SkinSelector } from 'src/layouts/Lobby/ChampSelect/CenterArea/SkinSelector';
import { ActionButton } from '@render/layouts/Lobby/ChampSelect/CenterArea/ActionButton';
import { SpellSelect } from '@render/layouts/Lobby/ChampSelect/CenterArea/SpellSelect';
import { ChampionSelectList } from '@render/layouts/Lobby/ChampSelect/CenterArea/ChampionSelectList';
import { Runes } from '@render/layouts/Lobby/ChampSelect/CenterArea/Runes';
import { useChampSelectContext } from '@render/layouts/Lobby/ChampSelect/ChampSelectContext';
import { SubsetChampionPick } from '@render/layouts/Lobby/ChampSelect/CenterArea/SubsetChampionPick';

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
      <Stack
        direction={'column'}
        width={'100%'}
        justifyContent={'center'}
        alignItems={'center'}
        rowGap={1}
      >
        <ActionButton />
        <Stack
          direction={'row'}
          justifyContent={'center'}
          alignItems={'center'}
          columnGap={2}
        >
          <Runes />
          <SpellSelect />
        </Stack>
      </Stack>
    </Stack>
  );
};
