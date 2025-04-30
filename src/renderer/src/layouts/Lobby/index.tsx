import {
  ButtonBase,
  Grid,
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { LoadingScreen } from '@render/components/LoadingScreen';
import { useLeagueClientEvent } from '@render/hooks/useLeagueClientEvent';
import { useLeagueClientRequest } from '@render/hooks/useLeagueClientRequest';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import { GenericLobby } from '@render/layouts/Lobby/GenericLobby';
import { storeActions, useStore } from '@render/zustand/store';
import { LolGameQueuesV1Queues } from '@shared/typings/lol/response/lolGameQueuesV1Queues';
import { LolGameflowV1Session } from '@shared/typings/lol/response/lolGameflowV1Session';
import { PatcherV1ProductsLeagueOfLegendStateComponent } from '@shared/typings/lol/response/patcherV1ProductsLeagueOfLegendState';
import { useEffect, useState } from 'react';

export const Lobby = () => {
  const { makeRequest } = useLeagueClientRequest();
  const { rcpFeLolL10n } = useLeagueTranslate();
  // Constants
  const isAvailable = useStore().leagueClient.isAvailable();
  const queues = useStore().gameData.queues();
  const { isAvailable: setIsAvailable } = storeActions.leagueClient;

  // Variables
  const [queueList, setQueueList] = useState<LolGameQueuesV1Queues[]>([]);
  const [lobbySession, setLobbySession] = useState<LolGameflowV1Session>();
  const [patchingData, setPatchingData] =
    useState<PatcherV1ProductsLeagueOfLegendStateComponent['progress']>(null);

  const onClickQueue = (queue: LolGameQueuesV1Queues) => {
    makeRequest('POST', '/lol-lobby/v2/lobby', {
      queueId: queue.id,
    }).then();
    return;
  };

  const getQueueName = (id: number) => {
    return queues.find((q) => q.id === id)?.name;
  };

  // Events subscriptions
  useLeagueClientEvent('/lol-gameflow/v1/availability', (data) => {
    setIsAvailable(data.isAvailable);
  });

  useLeagueClientEvent(
    '/patcher/v1/products/league_of_legends/state',
    (data) => {
      if (data.action === 'Patching' && data.components[0]?.progress) {
        setPatchingData(data.components[0].progress);
      } else {
        setPatchingData(null);
      }
    },
  );

  useLeagueClientEvent('/lol-gameflow/v1/session', (data) => {
    if (data.gameData.queue.id !== -1) {
      setLobbySession(data);
    } else {
      setLobbySession(undefined);
    }
  });

  useEffect(() => {
    makeRequest('GET', '/lol-game-queues/v1/queues', undefined).then((res) => {
      if (res.ok) {
        setQueueList(res.body);
      }
    });
  }, []);

  if (patchingData) {
    const msg = rcpFeLolL10n('trans')(
      `patcher_primary_work_${patchingData.primaryWork.toLowerCase()}`,
    );
    const calcPercent = (total: number, current: number) => {
      return Math.floor((current * 100) / total);
    };
    const { network, total } = patchingData;
    const percentBuffer = calcPercent(
      network.bytesRequired,
      network.bytesComplete,
    );
    const percentValue = calcPercent(total.bytesRequired, total.bytesComplete);
    return (
      <Stack
        direction={'column'}
        rowGap={1}
        height={'100%'}
        justifyContent={'center'}
        alignItems={'center'}
      >
        <Typography>{msg}</Typography>
        <Stack
          direction={'row'}
          columnGap={1}
          alignItems={'center'}
          width={'80%'}
        >
          <LinearProgress
            variant={'buffer'}
            value={percentValue}
            valueBuffer={percentBuffer}
            sx={{
              width: '100%',
            }}
          />
          <Typography>{percentValue}%</Typography>
        </Stack>
      </Stack>
    );
  }

  if (!isAvailable) {
    return <LoadingScreen height={'100%'} />;
  }

  if (lobbySession) {
    return <GenericLobby lobbySession={lobbySession} />;
  }

  return (
    <Grid container spacing={2} sx={{ p: 1 }}>
      {queueList
        .filter((q) => q.queueAvailability === 'Available' && q.isVisible)
        .map((q) => (
          <Grid key={q.id} size={{ xs: 4 }}>
            <Paper
              sx={{ p: 1 }}
              component={ButtonBase}
              onClick={() => onClickQueue(q)}
            >
              <Typography>{getQueueName(q.id)}</Typography>
            </Paper>
          </Grid>
        ))}
    </Grid>
  );
};
