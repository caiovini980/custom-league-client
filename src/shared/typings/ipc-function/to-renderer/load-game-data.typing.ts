import { Champion } from '@shared/typings/lol/json/champion';
import { Item } from '@shared/typings/lol/json/item';
import { Map } from '@shared/typings/lol/json/map';
import { Queue } from '@shared/typings/lol/json/queue';
import { SummonerSpells } from '@shared/typings/lol/json/summoner-spells';
import { TranslatePathKeys } from '@shared/utils/translate.util';

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
    champions: Champion[];
    spells: SummonerSpells[];
    items: Item[];
    maps: Map[];
    queues: Queue[];
    translate: Record<TranslatePathKeys, TranslateData>;
  };
}

export type LoadGameData =
  | LoadGameDataDownloading
  | LoadGameDataReading
  | LoadGameDataComplete;

type TranslateData = Record<string, Record<string, string>>;
