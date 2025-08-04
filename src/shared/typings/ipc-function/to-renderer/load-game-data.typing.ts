import { Champion } from '@shared/typings/lol/json/champion';
import { Item } from '@shared/typings/lol/json/item';
import { Map } from '@shared/typings/lol/json/map';
import { Perk } from '@shared/typings/lol/json/perk';
import { PerkStyles } from '@shared/typings/lol/json/perkStyles';
import { Queue } from '@shared/typings/lol/json/queue';
import { SummonerSpells } from '@shared/typings/lol/json/summoner-spells';
import { TranslatePathKeys } from '@shared/utils/translate.util';

export interface LoadGameDataError {
  status: 'error';
  info: null;
}

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
    perks: Perk[];
    perkStyles: PerkStyles[];
  };
}

export type LoadGameData =
  | LoadGameDataError
  | LoadGameDataDownloading
  | LoadGameDataReading
  | LoadGameDataComplete;

type TranslateData = Record<string, Record<string, string>>;
