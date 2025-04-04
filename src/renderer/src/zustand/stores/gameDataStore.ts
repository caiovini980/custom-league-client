import { Champion } from '@shared/typings/lol/json/champion';
import { Item } from '@shared/typings/lol/json/item';
import { SummonerSpells } from '@shared/typings/lol/json/summoner-spells';
import { createStore } from 'zustand-x';

export interface GameDataState {
  champions: Champion[];
  spells: SummonerSpells[];
  items: Item[];
}

const initialState: GameDataState = {
  champions: [],
  spells: [],
  items: [],
};

export const gameDataStore =
  createStore('gameData')<GameDataState>(initialState);
