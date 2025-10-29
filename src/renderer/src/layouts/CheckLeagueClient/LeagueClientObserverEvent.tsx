import { useLeagueClientEvent } from '@render/hooks/useLeagueClientEvent';
import { useLeagueClientRequest } from '@render/hooks/useLeagueClientRequest';
import { champSelectStore } from '@render/zustand/stores/champSelectStore';
import { currentSummonerStore } from '@render/zustand/stores/currentSummonerStore';
import { leagueClientStore } from '@render/zustand/stores/leagueClientStore';
import { lobbyStore } from '@render/zustand/stores/lobbyStore';

export const LeagueClientObserverEvent = () => {
  const { makeRequest } = useLeagueClientRequest();

  useLeagueClientEvent('/process-control/v1/process', (data) => {
    const stopping = data.status === 'Stopping';
    leagueClientStore.isStopping.set(stopping);
  });

  useLeagueClientEvent('/lol-summoner/v1/current-summoner', (data) => {
    currentSummonerStore.info.set(data);
  });

  useLeagueClientEvent('/lol-lobby/v2/lobby', (data) => {
    lobbyStore.lobby.set(data);
  });

  useLeagueClientEvent('/lol-gameflow/v1/availability', (data) => {
    leagueClientStore.isAvailable.set(data.isAvailable);
  });

  useLeagueClientEvent('/lol-gameflow/v1/session', (data) => {
    lobbyStore.gameFlow.set(data);
  });

  useLeagueClientEvent('/lol-gameflow/v1/gameflow-phase', (data) => {
    if (['None', 'GameStart', 'InProgress'].includes(data)) {
      lobbyStore.resetState();
    }
    if (data !== 'ChampSelect') {
      champSelectStore.resetState();
    }
    if (['ChampSelect', 'Lobby'].includes(data)) {
      setTimeout(() => {
        lobbyStore.matchMaking.set(null);
      }, 500);
    }
  });

  useLeagueClientEvent('/lol-champ-select/v1/session', (data) => {
    champSelectStore.session.set(data);
  });

  useLeagueClientEvent('/lol-champ-select-legacy/v1/session', (data) => {
    champSelectStore.legacySession.set(data);
  });

  useLeagueClientEvent('/lol-activity-center/v1/ready', (data) => {
    leagueClientStore.systemReady.activeCenter.set(data);
    if (data) {
      loadSomeAreas();
    }
  });

  useLeagueClientEvent('/lol-store/v1/store-ready', (data) => {
    leagueClientStore.systemReady.store.set(data);
  });

  useLeagueClientEvent('/lol-loot/v1/ready', (data) => {
    leagueClientStore.systemReady.loot.set(data);
  });

  useLeagueClientEvent('/lol-yourshop/v1/ready', (data) => {
    leagueClientStore.systemReady.yourShop.set(data);
  });

  useLeagueClientEvent('/lol-objectives/v1/ready', (data) => {
    leagueClientStore.systemReady.objectives.set(data);
  });

  useLeagueClientEvent('/lol-chat/v1/session', (data) => {
    leagueClientStore.systemReady.chat.set(data.sessionState === 'loaded');
  });

  useLeagueClientEvent('/lol-ranked/v1/signed-ranked-stats', () => {
    leagueClientStore.systemReady.ranked.set(true);
  });

  useLeagueClientEvent(
    '/lol-platform-config/v1/initial-configuration-complete',
    (data) => {
      leagueClientStore.systemReady.platformConfig.set(data);
    },
  );

  const loadSomeAreas = () => {
    makeRequest('GET', '/lol-store/v1/status', undefined).then();
    makeRequest('GET', '/lol-yourshop/v1/status', undefined).then();
  };
  return null;
};
