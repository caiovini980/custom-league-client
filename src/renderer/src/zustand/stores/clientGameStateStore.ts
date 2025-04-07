import { createStore } from 'zustand-x';

export enum ClientGameStates {
  NULL = 0,

  // Main menu states
  MAIN_MENU = 1,

  // Game creation states
  ARAM_ROOM = 2,
  ARAM_LOBBY = 3,
  NORMAL_ROOM = 4,
  NORMAL_LOBBY = 5,

  // Gameplay states
  IN_GAME = 6,
}

export interface CurrentClientGameState {
  currentState: ClientGameStates;
}

const initialClientState: CurrentClientGameState = {
  currentState: ClientGameStates.NULL,
};

export const clientGameStateStore =
  createStore('currentClientState')<CurrentClientGameState>(initialClientState);
