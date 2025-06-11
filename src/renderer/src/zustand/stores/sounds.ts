import { createStore } from 'zustand-x';

export interface SoundState {
  volume: number;
}

const initialState: SoundState = {
  volume: 1,
};

export const soundStore = createStore('sound')<SoundState>(initialState);
