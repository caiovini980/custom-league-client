import {
  List,
  ListItemButton,
  ListItemText,
  ListSubheader,
} from '@mui/material';
import { useLeagueClientRequest } from '@render/hooks/useLeagueClientRequest';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import { gameDataStore } from '@render/zustand/stores/gameDataStore';
import { lobbyStore } from '@render/zustand/stores/lobbyStore';
import { LolGameQueuesV1Queues } from '@shared/typings/lol/response/lolGameQueuesV1Queues';
import { Fragment, useEffect, useState } from 'react';
import { FaClock } from 'react-icons/fa6';

interface QueueGroup {
  name: string;
  queues: LolGameQueuesV1Queues[];
  hidden?: boolean;
}

export const QueueList = () => {
  const { makeRequest } = useLeagueClientRequest();
  const { rcpFeLolParties } = useLeagueTranslate();

  const allowedChangeActivity = lobbyStore.lobby.use(
    (s) => s?.localMember.allowedChangeActivity ?? false,
  );
  const gameFlowPhase = lobbyStore.gameFlow.use((s) => s?.phase ?? 'None');
  const queueId = lobbyStore.gameFlow.use((s) => s?.gameData.queue.id);

  const [queueList, setQueueList] = useState<LolGameQueuesV1Queues[]>([]);

  const onClickQueue = (queue: LolGameQueuesV1Queues) => {
    makeRequest('POST', '/lol-lobby/v2/lobby', {
      queueId: queue.id,
    }).then();
    return;
  };

  const getQueueNameByQueueId = (queueId: number) => {
    return gameDataStore.queueNameById.get(queueId);
  };

  const queuesFiltered = queueList.filter(
    (q) => q.queueAvailability === 'Available' && q.isVisible,
  );

  const getQueuesGrouped = () => {
    if (!queuesFiltered.length) return [];
    const queuesGrouped: QueueGroup[] = [];

    const { rcpFeLolPartiesTrans } = rcpFeLolParties;

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
    const trainingQueue = queuesFiltered.filter(
      (q) =>
        q.gameSelectModeGroup === 'kAlternativeLeagueGameModes' &&
        q.gameSelectCategory === 'kTraining',
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

    queuesGrouped.push({
      name: rcpFeLolPartiesTrans('parties_game_category_ktraining'),
      queues: trainingQueue,
      hidden: true,
    });

    return queuesGrouped;
  };

  const disabledList = () => {
    if (['None', 'Lobby'].includes(gameFlowPhase)) return false;
    return gameFlowPhase === 'Matchmaking' || !allowedChangeActivity;
  };

  useEffect(() => {
    makeRequest('GET', '/lol-game-queues/v1/queues', undefined).then((res) => {
      const gameMode = ['CLASSIC', 'ARAM', 'TFT', 'PRACTICETOOL', 'KIWI'];
      if (res.ok) {
        setQueueList(res.body.filter((q) => gameMode.includes(q.gameMode)));
      }
    });
  }, []);

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
        .filter((q) => !q.hidden)
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
                selected={q.id === queueId}
                disabled={gameFlowPhase === 'Matchmaking'}
              >
                <ListItemText>{getQueueNameByQueueId(q.id)}</ListItemText>
                {q.isLimitedTimeQueue && <FaClock />}
              </ListItemButton>
            ))}
          </Fragment>
        ))}
    </List>
  );
};
