import { ClientGameStates } from '@render/zustand/stores/clientGameStateStore';
import { storeActions, useStore } from '@render/zustand/store';

export const useClientGameState = () => {
  const currentGameState = useStore().clientGameState.currentState();

  function setClientGameState(newState: ClientGameStates) {
    storeActions.clientGameState.currentState(newState);
  }

  return { setClientGameState, currentGameState };
};
