import { Stack } from '@mui/material';
import { AramBenchChampions } from '@render/layouts/Lobby/ChampSelect/AramBenchChampions';
import { ChampionSelectWrapper } from '@render/layouts/Lobby/ChampSelect/ChampionSelectWrapper';
import { QuitSpectatingBtn } from '@render/layouts/Lobby/ChampSelect/Legacy/QuitSpectatingBtn';
import { TeamPlayer } from '@render/layouts/Lobby/ChampSelect/TeamPlayer';
import { Timer } from '@render/layouts/Lobby/ChampSelect/Timer';

export const Legacy = () => {
  return (
    <ChampionSelectWrapper>
      <Stack
        direction={'column'}
        height={'100%'}
        width={'100%'}
        overflow={'auto'}
        p={1}
        rowGap={1}
      >
        <Timer />
        <AramBenchChampions />
        <Stack
          direction={'row'}
          columnGap={1}
          justifyContent={'space-between'}
          height={'100%'}
          overflow={'auto'}
        >
          <TeamPlayer />
          <TeamPlayer isEnemyTeam />
        </Stack>
        <QuitSpectatingBtn />
      </Stack>
    </ChampionSelectWrapper>
  );
};
