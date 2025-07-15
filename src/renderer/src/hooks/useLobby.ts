import { currentSummonerStore } from '@render/zustand/stores/currentSummonerStore';
import { gameDataStore } from '@render/zustand/stores/gameDataStore';
import { lobbyStore } from '@render/zustand/stores/lobbyStore';

export const useLobby = () => {
  const lobby = lobbyStore.lobby.use();
  const gameFlow = lobbyStore.gameFlow.use();
  const matchMakingErros = lobbyStore.matchMaking.use()?.errors ?? [];
  const queues = gameDataStore.queues.use();
  const currentSummonerId = currentSummonerStore.info.use()?.summonerId ?? 0;

  const getLobbyOrThrow = () => {
    if (!lobby) {
      throw new Error('Lobby not data');
    }
    return lobby;
  };

  const canStartActivity = () => {
    if (!lobby?.localMember.allowedStartActivity) {
      return false;
    }
    return (
      (lobby?.canStartActivity && !lobby?.restrictions?.length) ||
      !!matchMakingErros.length
    );
  };

  const getQueueName = () => {
    return getQueueNameByQueueId(gameFlow?.gameData.queue.id ?? 0);
  };

  const getQueueNameByQueueId = (queueId: number) => {
    return queues.find((q) => q.id === queueId)?.name;
  };

  return {
    setLobby: lobbyStore.lobby.set,
    getLobby: () => lobby,
    getLobbyOrThrow,
    canStartActivity,
    getQueueName,
    getQueueNameByQueueId,
    currentSummonerId,
    phase: gameFlow?.phase ?? 'None',
  };
};
