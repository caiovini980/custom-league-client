import { Champion } from '@shared/typings/lol/json/champion';
import { Item } from '@shared/typings/lol/json/item';
import { SummonerSpells } from '@shared/typings/lol/json/summoner-spells';

export interface LoadGameDataDownloading {
  status: 'downloading';
  info: {
    currentPercent: number;
    currentFileDownloading: string;
  };
}

export interface LoadGameDataReading {
  status: 'reading';
  info: null;
}

export interface LoadGameDataComplete {
  status: 'complete';
  info: {
    championData: Champion[];
    spellData: SummonerSpells[];
    items: Item[];
  };
}

export type LoadGameData =
  | LoadGameDataDownloading
  | LoadGameDataReading
  | LoadGameDataComplete;
