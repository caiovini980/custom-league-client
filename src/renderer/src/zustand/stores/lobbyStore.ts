import { Null } from '@shared/typings/generic.typing';
import { LolMatchmakingV1Search } from '@shared/typings/lol/response/lolMatchmakingV1Search';
import { createStore } from 'zustand-x';
import { LolLobbyV2Lobby } from '@shared/typings/lol/response/lolLobbyV2Lobby';
import { LolGameflowV1Session } from '@shared/typings/lol/response/lolGameflowV1Session';

export interface MatchMakingState {
  lobby: Null<LolLobbyV2Lobby>;
  gameFlow: Null<LolGameflowV1Session>;
  matchMaking: Null<LolMatchmakingV1Search>;
}

const initialState: MatchMakingState = {
  lobby: null,
  gameFlow: null,
  matchMaking: null,
};

export const lobbyStore = createStore('lobby')<MatchMakingState>(initialState, {
  devtools: { enabled: true },
}).extendActions((set) => ({
  resetState: () => {
    set.state(() => initialState);
  },
}));
