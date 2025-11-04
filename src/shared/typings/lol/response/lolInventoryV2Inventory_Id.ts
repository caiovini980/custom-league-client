import { Null } from '@shared/typings/generic.typing';

export type InventoryType =
  | 'CURRENCY'
  | 'AUGMENT'
  | 'BOOST'
  | 'CHAMPION'
  | 'CHAMPION_SKIN'
  | 'COMPANION'
  | 'NEXUS_FINISHER'
  | 'REGALIA_BANNER'
  | 'REGALIA_CREST'
  | 'QUEUE_ENTRY'
  | 'SKIN_BORDER'
  | 'SKIN_AUGMENT'
  | 'WARD_SKIN'
  | 'SUMMONER_ICON'
  | 'ACHIEVEMENT_TITLE'
  | 'EMOTE'
  | 'STATSTONE'
  | 'EVENT_PASS'
  | 'MODE_PROGRESSION_REWARD'
  | 'SPELL_BOOK_PAGE'
  | 'TFT_MAP_SKIN'
  | 'TFT_ZOOM_SKIN'
  | 'TFT_PLAYBOOK'
  | 'TFT_EVENT_PVE_DIFFICULT'
  | 'TFT_EVENT_PVE_BUDDY'
  | 'TFT_DAMAGE_SKIN'
  | 'TOURNAMENT_LOGO'
  | 'TOURNAMENT_FLAG'
  | 'TOURNAMENT_TROPHY';

export interface LolInventoryV2Inventory_Id {
  expirationDate: string;
  f2p: boolean;
  inventoryType: InventoryType;
  itemId: number;
  loyalty: boolean;
  loyaltySources: unknown[];
  owned: boolean;
  ownershipType: string;
  payload: Null<LolInventoryV2Inventory_IdPayload>;
  purchaseDate: string;
  quantity: number;
  rental: boolean;
  usedInGameDate: string;
  uuid: string;
  wins: number;
}

export interface LolInventoryV2Inventory_IdPayload {}
