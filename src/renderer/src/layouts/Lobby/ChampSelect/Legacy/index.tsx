import { Stack } from '@mui/material';
import { LoadingScreen } from '@render/components/LoadingScreen';
import { useLeagueClientEvent } from '@render/hooks/useLeagueClientEvent';
import { AramBenchChampions } from '@render/layouts/Lobby/ChampSelect/AramBenchChampions';
import { ChampionSelectWrapper } from '@render/layouts/Lobby/ChampSelect/ChampionSelectWrapper';
import { TeamPlayer } from '@render/layouts/Lobby/ChampSelect/TeamPlayer';
import { Timer } from '@render/layouts/Lobby/ChampSelect/Timer';
import { champSelectStore } from '@render/zustand/stores/champSelectStore';

export const Legacy = () => {
  const isChampionSelectLegacy = champSelectStore.use(
    (s) => !!s.legacySession.id,
  );

  useLeagueClientEvent('/lol-champ-select-legacy/v1/session', (data) => {
    champSelectStore.legacySession.set(data);
  });

  if (!isChampionSelectLegacy) {
    return <LoadingScreen fullArea />;
  }

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
      </Stack>
    </ChampionSelectWrapper>
  );
};
