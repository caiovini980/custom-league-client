export interface LolStoreV1Catalog_InventoryType {
  active: boolean;
  bundled: null;
  iconUrl: string;
  inactiveDate: null;
  inventoryType: string;
  itemId: number;
  itemInstanceId: string;
  itemRequirements: null;
  localizations: LolStoreV1Catalog_InventoryTypeLocalizations;
  maxQuantity: number;
  metadata: null;
  offerId: string;
  prices: LolStoreV1Catalog_InventoryTypePrice[];
  releaseDate: string;
  sale: null | LolStoreV1Catalog_InventoryTypeSale;
  subInventoryType: null;
  tags: string[];
}

export interface LolStoreV1Catalog_InventoryTypeLocalizations {
  [key: string]: {
    description: string;
    language: string;
    name: string;
  };
}

export interface LolStoreV1Catalog_InventoryTypeSale {
  endDate: string;
  prices: LolStoreV1Catalog_InventoryTypePrice[];
  startDate: string;
}

export interface LolStoreV1Catalog_InventoryTypePrice {
  cost: number;
  currency: 'RP';
  discount: number;
}
