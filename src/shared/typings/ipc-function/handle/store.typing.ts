export type StoreView =
  | 'skins'
  | 'champions'
  | 'featured'
  | 'hextech'
  | 'emotes'
  | 'tickets'
  | 'ward_skins'
  | 'icons'
  | 'boosts'
  | 'runes'
  | 'bundles_accessories'
  | 'chromas'
  | 'bundles_skins';

export interface StoreResponse {
  player: StoreResponsePlayer;
  catalog: StoreResponseCatalog[];
  groupOrder: string[];
  itemGroups: StoreResponseItemGroups;
}

export interface StoreResponsePlayer {
  accountId: number;
  rp: number;
  ip: number;
  summonerLevel: number;
}

export interface StoreResponseCatalog {
  itemId: number;
  inventoryType: string;
  subInventoryType?: string;
  iconUrl: string;
  maxQuantity: number;
  rp: number;
  ip: number;
  releaseDate: number;
  name: string;
  description?: string;
  tags: string[];
  purchaseLimitReached: boolean;
  inactiveDate?: string;
  ownedQuantity?: number;
  owned?: boolean;
  metadata?: Metadaum[];
  sale?: Sale;
  parentItem?: {
    itemId: number;
    inventoryType: string;
  };
}

export interface Metadaum {
  type: string;
  value: string;
}

export interface Sale {
  rp: number;
  percentOff: number;
  endDate: string;
}

export interface StoreResponseItemGroups {
  [key: string]: ItemGroup;
}

export interface ItemGroup {
  items: Item[];
  hideable: boolean;
  grouped: boolean;
}

export interface Item {
  inventoryType: string;
  itemId: number;
}
