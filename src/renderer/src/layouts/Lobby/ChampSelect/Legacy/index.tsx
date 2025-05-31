import { Stack } from '@mui/material';
import { Timer } from '@render/layouts/Lobby/ChampSelect/Timer';
import { AramBenchChampions } from '@render/layouts/Lobby/ChampSelect/AramBenchChampions';
import { TeamPlayer } from '@render/layouts/Lobby/ChampSelect/TeamPlayer';
import { ChampSelectContext } from '@render/layouts/Lobby/ChampSelect/ChampSelectContext';
import { useLeagueClientEvent } from '@render/hooks/useLeagueClientEvent';
import { useState } from 'react';
import { LolChampSelectV1Session } from '@shared/typings/lol/response/lolChampSelectV1Session';
import { LoadingScreen } from '@render/components/LoadingScreen';

interface LegacyProps {
  gameMode: string;
}

export const Legacy = ({ gameMode }: LegacyProps) => {
  const [session, setSession] = useState<LolChampSelectV1Session>();

  useLeagueClientEvent('/lol-champ-select-legacy/v1/session', (data) => {
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
      </Stack>
    </ChampSelectContext>
  );
};
