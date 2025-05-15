import { useLeagueClientEvent } from '@render/hooks/useLeagueClientEvent';
import { useState } from 'react';
import { LolChampSelectV1Session } from '@shared/typings/lol/response/lolChampSelectV1Session';
import { LoadingScreen } from '@render/components/LoadingScreen';
import { Stack } from '@mui/material';
import { TeamPlayer } from '@render/layouts/Lobby/ChampSelect/TeamPlayer';
import { AramBenchChampions } from '@render/layouts/Lobby/ChampSelect/AramBenchChampions';
import { Timer } from '@render/layouts/Lobby/ChampSelect/Timer';
import config from '@render/utils/config.util';
import { CenterArea } from '@render/layouts/Lobby/ChampSelect/CenterArea';
import { ChampSelectContext } from '@render/layouts/Lobby/ChampSelect/ChampSelectContext';

interface ChampSelectProps {
  gameMode: string;
}

export const ChampSelect = ({ gameMode }: ChampSelectProps) => {
  const [session, setSession] = useState<LolChampSelectV1Session>();

  useLeagueClientEvent('/lol-champ-select/v1/session', (data) => {
    setSession(data);
  });

  if (!session) {
    return <LoadingScreen fullArea />;
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
        pb={`${config.bottomBarOffset}px`}
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
          <TeamPlayer team={session.myTeam} />
          <CenterArea />
          <TeamPlayer team={session.theirTeam} isEnemyTeam />
        </Stack>
      </Stack>
    </ChampSelectContext>
  );
};
