import {
  Divider,
  LinearProgress,
  List,
  ListItemButton,
  ListItemText,
  ListSubheader,
  Stack,
  Typography,
} from '@mui/material';
import { LoadingScreen } from '@render/components/LoadingScreen';
import { useLeagueClientEvent } from '@render/hooks/useLeagueClientEvent';
import { useLeagueClientRequest } from '@render/hooks/useLeagueClientRequest';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import { ChampSelect } from '@render/layouts/Lobby/ChampSelect';
import { GenericLobby } from '@render/layouts/Lobby/GenericLobby';
import { useStore } from '@render/zustand/store';
import { LolGameQueuesV1Queues } from '@shared/typings/lol/response/lolGameQueuesV1Queues';
import { PatcherV1ProductsLeagueOfLegendStateComponent } from '@shared/typings/lol/response/patcherV1ProductsLeagueOfLegendState';
import { Fragment, useEffect, useState } from 'react';
import { InGame } from '@render/layouts/Lobby/InGame';
import { Reconnect } from '@render/layouts/Lobby/Reconnect';
import { PreEndGame } from '@render/layouts/Lobby/PreEndGame';

export const Lobby = () => {
  const { makeRequest } = useLeagueClientRequest();
  const { rcpFeLolL10n, rcpFeLolParties } = useLeagueTranslate();

  const isAvailable = useStore().leagueClient.isAvailable();
  const queues = useStore().gameData.queues();
  const gameFlow = useStore().lobby.gameFlow();

  const [queueList, setQueueList] = useState<LolGameQueuesV1Queues[]>([]);
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

  useEffect(() => {
    if (!isAvailable) {
      setQueueList([]);
      return;
    }
    makeRequest('GET', '/lol-game-queues/v1/queues', undefined).then((res) => {
      if (res.ok) {
        setQueueList(res.body);
      }
    });
  }, [isAvailable]);

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

  const queuesFiltered = queueList.filter(
    (q) => q.queueAvailability === 'Available' && q.isVisible,
  );

  if (!isAvailable) {
    return <LoadingScreen height={'100%'} />;
  }

  if (gameFlow?.phase === 'ChampSelect') {
    return <ChampSelect />;
  }

  if (gameFlow?.phase === 'InProgress') {
    return <InGame />;
  }

  if (gameFlow?.phase === 'Reconnect') {
    return <Reconnect />;
  }

  if (gameFlow?.phase === 'PreEndOfGame') {
    return <PreEndGame />;
  }

  const getQueuesGrouped = () => {
    if (!queuesFiltered.length) return [];
    const queuesGrouped: { name: string; queues: LolGameQueuesV1Queues[] }[] =
      [];

    const rcpFeLolPartiesTrans = rcpFeLolParties('trans');

    const tftQueues = queuesFiltered.filter(
      (q) =>
        q.gameSelectModeGroup === 'kTeamfightTactics' &&
        q.gameSelectCategory === 'kPvP',
    );
    const summonersRiftQueues = queuesFiltered.filter(
      (q) =>
        q.gameSelectModeGroup === 'kSummonersRift' &&
        q.gameSelectCategory === 'kPvP',
    );
    const aramQueues = queuesFiltered.filter(
      (q) =>
        q.gameSelectModeGroup === 'kARAM' && q.gameSelectCategory === 'kPvP',
    );
    const otherQueues = queuesFiltered.filter(
      (q) =>
        q.gameSelectModeGroup === 'kAlternativeLeagueGameModes' &&
        q.gameSelectCategory === 'kPvP',
    );

    const coopVsAiQueues = queuesFiltered.filter(
      (q) =>
        q.gameSelectModeGroup === 'kSummonersRift' &&
        q.gameSelectCategory === 'kVersusAI',
    );

    queuesGrouped.push({
      name: rcpFeLolPartiesTrans('parties_game_category_kpvp'),
      queues: summonersRiftQueues,
    });

    queuesGrouped.push({
      name: aramQueues[0]?.name ?? '-',
      queues: aramQueues,
    });

    queuesGrouped.push({
      name: otherQueues[0]?.name ?? '-',
      queues: otherQueues,
    });

    queuesGrouped.push({
      name: 'TFT',
      queues: tftQueues,
    });

    queuesGrouped.push({
      name: rcpFeLolPartiesTrans('parties_game_category_kversusai'),
      queues: coopVsAiQueues,
    });

    return queuesGrouped;
  };

  return (
    <Stack direction={'row'} height={'100%'}>
      <List sx={{ overflow: 'auto' }} dense disablePadding>
        {getQueuesGrouped().map((qGrouped) => (
          <Fragment key={qGrouped.name}>
            <ListSubheader component="div" sx={{ textAlign: 'center' }}>
              {qGrouped.name}
            </ListSubheader>
            {qGrouped.queues.map((q) => (
              <ListItemButton
                key={q.id}
                onClick={() => onClickQueue(q)}
                selected={q.id === gameFlow?.gameData.queue.id}
              >
                <ListItemText>{getQueueName(q.id)}</ListItemText>
              </ListItemButton>
            ))}
          </Fragment>
        ))}
      </List>
      <Divider orientation={'vertical'} />
      {gameFlow?.phase !== 'None' && <GenericLobby />}
    </Stack>
  );
};
