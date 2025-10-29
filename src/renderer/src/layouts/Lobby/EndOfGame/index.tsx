import { Stack } from '@mui/material';
import { LoadingScreen } from '@render/components/LoadingScreen';
import { useLeagueClientRequest } from '@render/hooks/useLeagueClientRequest';
import { EndGameActionButton } from '@render/layouts/Lobby/EndOfGame/EndGameActionButton';
import { EndGameChatGroup } from '@render/layouts/Lobby/EndOfGame/EndGameChatGroup';
import { TeamStatus } from '@render/layouts/Lobby/EndOfGame/TeamStatus';
import { Title } from '@render/layouts/Lobby/EndOfGame/Title';
import { LolEndOfGameV1EogStatsBlock } from '@shared/typings/lol/response/lolEndOfGameV1EogStatsBlock';
import { useEffect, useState } from 'react';

export const EndOfGame = () => {
  const { makeRequest } = useLeagueClientRequest();

  const [data, setData] = useState<LolEndOfGameV1EogStatsBlock>();

  useEffect(() => {
    makeRequest('GET', '/lol-end-of-game/v1/eog-stats-block', undefined).then(
      (res) => {
        if (res.ok) {
          setData(res.body);
        }
      },
    );
  }, []);
  console.log(data);
  return (
    <Stack p={1} direction={'column'} width={'100%'} alignItems={'center'}>
      {data ? (
        <Stack direction={'column'} height={'100%'} width={'100%'}>
          <Title data={data} />
          {data.teams.map((team) => {
            return (
              <TeamStatus
                key={team.teamId}
                team={team}
                gameLength={data.gameLength}
              />
            );
          })}
        </Stack>
      ) : (
        <LoadingScreen />
      )}
      <Stack
        direction={'row'}
        justifyContent={'space-evenly'}
        alignItems={'center'}
        width={'100%'}
      >
        <EndGameChatGroup mucJwtDto={data?.mucJwtDto} />
        <EndGameActionButton />
      </Stack>
    </Stack>
  );
};
