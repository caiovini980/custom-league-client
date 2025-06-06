import {
  List,
  ListItemButton,
  ListItemText,
  ListSubheader,
} from '@mui/material';
import { Fragment, useEffect, useState } from 'react';
import { LolGameQueuesV1Queues } from '@shared/typings/lol/response/lolGameQueuesV1Queues';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import { useLeagueClientRequest } from '@render/hooks/useLeagueClientRequest';
import { useStore } from '@render/zustand/store';
import { useLobby } from '@render/hooks/useLobby';

export const QueueList = () => {
  const { makeRequest } = useLeagueClientRequest();
  const { rcpFeLolParties } = useLeagueTranslate();
  const { getQueueNameByQueueId, getLobby } = useLobby();

  const gameFlow = useStore().lobby.gameFlow();

  const [queueList, setQueueList] = useState<LolGameQueuesV1Queues[]>([]);

  useEffect(() => {
    makeRequest('GET', '/lol-game-queues/v1/queues', undefined).then((res) => {
      const queuesAvailable = [400, 420, 440, 480, 450];
      if (res.ok) {
        setQueueList(res.body.filter((q) => queuesAvailable.includes(q.id)));
      }
    });
  }, []);

  const onClickQueue = (queue: LolGameQueuesV1Queues) => {
    makeRequest('POST', '/lol-lobby/v2/lobby', {
      queueId: queue.id,
    }).then();
    return;
  };

  const queuesFiltered = queueList.filter(
    (q) => q.queueAvailability === 'Available' && q.isVisible,
  );

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

  const disabledList = () => {
    if (gameFlow) {
      if (gameFlow.phase === 'None') return false;
      return (
        gameFlow.phase === 'Matchmaking' ||
        !getLobby()?.localMember.allowedChangeActivity
      );
    }
    return false;
  };

  return (
    <List
      sx={{
        overflow: 'auto',
        width: disabledList() ? 0 : 240,
        flexShrink: 0,
        transition: (t) =>
          t.transitions.create('width', {
            duration: 200,
          }),
      }}
      dense
      disablePadding
    >
      {getQueuesGrouped()
        .filter((q) => q.queues.length)
        .map((qGrouped) => (
          <Fragment key={qGrouped.name}>
            <ListSubheader component="div" sx={{ textAlign: 'center' }}>
              {qGrouped.name}
            </ListSubheader>
            {qGrouped.queues.map((q) => (
              <ListItemButton
                key={q.id}
                onClick={() => onClickQueue(q)}
                selected={q.id === gameFlow?.gameData.queue.id}
                disabled={gameFlow?.phase === 'Matchmaking'}
              >
                <ListItemText>{getQueueNameByQueueId(q.id)}</ListItemText>
              </ListItemButton>
            ))}
          </Fragment>
        ))}
    </List>
  );
};
