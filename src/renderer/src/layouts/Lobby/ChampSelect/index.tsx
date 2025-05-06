import { useLeagueClientEvent } from '@render/hooks/useLeagueClientEvent';
import { useState } from 'react';
import { LolChampSelectV1Session } from '@shared/typings/lol/response/lolChampSelectV1Session';
import { LoadingScreen } from '@render/components/LoadingScreen';
import { Stack } from '@mui/material';
import { ChampionSelectList } from '@render/layouts/Lobby/ChampSelect/ChampionSelectList';
import { TeamPlayer } from '@render/layouts/Lobby/ChampSelect/TeamPlayer';
import { AramBenchChampions } from '@render/layouts/Lobby/ChampSelect/AramBenchChampions';
import { Timer } from '@render/layouts/Lobby/ChampSelect/Timer';
import config from '@render/utils/config.util';

export const ChampSelect = () => {
  const [session, setSession] = useState<LolChampSelectV1Session>();

  useLeagueClientEvent('/lol-champ-select/v1/session', (data) => {
    setSession(data);
  });

  if (!session) {
    return <LoadingScreen fullArea />;
  }

  return (
    <Stack
      direction={'row'}
      columnGap={1}
      justifyContent={'space-between'}
      height={'100%'}
      overflow={'auto'}
      mb={`${config.bottomBarOffset}px`}
    >
      <TeamPlayer
        session={session}
        team={session.myTeam}
        bans={session.bans.myTeamBans}
      />
      <Stack
        direction={'column'}
        height={'100%'}
        width={'100%'}
        overflow={'auto'}
      >
        <AramBenchChampions session={session} />
        <Timer session={session} />
        <ChampionSelectList session={session} />
      </Stack>
      <TeamPlayer
        session={session}
        team={session.theirTeam}
        bans={session.bans.theirTeamBans}
      />
    </Stack>
  );
};
