import { storeActions, useStore } from '@render/zustand/store';

export const useLobby = () => {
  const lobby = useStore().lobby.lobby();
  const gameFlow = useStore().lobby.gameFlow();
  const matchMakingErros = useStore().lobby.matchMaking()?.errors ?? [];
  const setLobby = storeActions.lobby.lobby;
  const queues = useStore().gameData.queues();
  const currentSummonerId = useStore().currentSummoner.info()?.summonerId ?? 0;

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
    return queues.find((q) => q.id === gameFlow?.gameData.queue.id)?.name;
  };

  return {
    setLobby,
    getLobby: () => lobby,
    getLobbyOrThrow,
    canStartActivity,
    getQueueName,
    currentSummonerId,
    phase: gameFlow?.phase ?? 'None',
  };
};
