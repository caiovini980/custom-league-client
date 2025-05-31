import { LoadingScreen } from '@render/components/LoadingScreen';
import { Stack } from '@mui/material';
import { TeamPlayer } from '@render/layouts/Lobby/ChampSelect/TeamPlayer';
import { AramBenchChampions } from '@render/layouts/Lobby/ChampSelect/AramBenchChampions';
import { Timer } from '@render/layouts/Lobby/ChampSelect/Timer';
import { CenterArea } from '@render/layouts/Lobby/ChampSelect/CenterArea';
import { ChampSelectContext } from '@render/layouts/Lobby/ChampSelect/ChampSelectContext';
import { useStore } from '@render/zustand/store';
import { Legacy } from '@render/layouts/Lobby/ChampSelect/Legacy';

interface ChampSelectProps {
  gameMode: string;
}

export const ChampSelect = ({ gameMode }: ChampSelectProps) => {
  const session = useStore().lobby.champSelect();

  if (!session) {
    return <LoadingScreen fullArea />;
  }

  if (session.isLegacyChampSelect) {
    return <Legacy gameMode={gameMode} />;
  }

  return (
    <ChampSelectContext session={session} gameMode={gameMode}>
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
          <CenterArea />
          <TeamPlayer isEnemyTeam />
        </Stack>
      </Stack>
    </ChampSelectContext>
  );
};
