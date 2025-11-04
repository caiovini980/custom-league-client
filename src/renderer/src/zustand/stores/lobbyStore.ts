import { store } from '@davstack/store';
import { champSelectStore } from '@render/zustand/stores/champSelectStore';
import { gameDataStore } from '@render/zustand/stores/gameDataStore';
import { Null } from '@shared/typings/generic.typing';
import { LolGameflowV1Session } from '@shared/typings/lol/response/lolGameflowV1Session';
import { LolLobbyV2Lobby } from '@shared/typings/lol/response/lolLobbyV2Lobby';
import { LolMatchmakingV1Search } from '@shared/typings/lol/response/lolMatchmakingV1Search';

export interface LobbyState {
  autoAccept: boolean;
  lobby: Null<LolLobbyV2Lobby>;
  gameFlow: Null<LolGameflowV1Session>;
  matchMaking: Null<LolMatchmakingV1Search>;
}

const initialState: LobbyState = {
  autoAccept: false,
  lobby: null,
  gameFlow: null,
  matchMaking: null,
};

export const lobbyStore = store(initialState, {
  name: 'lobby',
  devtools: { enabled: true },
})
  .actions((store) => ({
    resetState: () => {
      store.set({ ...initialState, autoAccept: store.autoAccept.get() });
    },
  }))
  .computed((store) => ({
    canStartActivity: () =>
      store.lobby.use((lobby) => {
        const allowedStartActivity =
          lobby?.localMember.allowedStartActivity ?? false;
        const canStartActivityLobby = lobby?.canStartActivity ?? false;
        const hasLobbyRestriction = !!lobby?.restrictions?.length;
        const hasMatchMakingErros = store.matchMaking.use(
          (s) => !!s?.errors.length,
        );

        if (!allowedStartActivity) {
          return false;
        }
        return (
          (canStartActivityLobby && !hasLobbyRestriction) ||
          !hasMatchMakingErros
        );
      }),
    currentQueueName: () =>
      store.gameFlow.use((gameFlow) => {
        const queueId = gameFlow?.gameData.queue.id;
        const queues = gameDataStore.queues.get();
        return queues.find((q) => q.id === queueId)?.name ?? '';
      }),
  }))
  .effects((store) => ({
    onChangeGameMode: () =>
      store.gameFlow.onChange((value) => {
        champSelectStore.gameMode.set(value?.gameData.queue.gameMode ?? '');
      }),
  }));
