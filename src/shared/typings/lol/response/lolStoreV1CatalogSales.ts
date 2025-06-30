export interface LolStoreV1CatalogSales {
  active: boolean;
  id: number;
  item: LolStoreV1CatalogSalesItem;
  sale: LolStoreV1CatalogSalesSale;
}

export interface LolStoreV1CatalogSalesItem {
  inventoryType: 'CHAMPION_SKIN' | 'CHAMPION';
  itemId: number;
}

export interface LolStoreV1CatalogSalesSale {
  endDate: string;
  prices: LolStoreV1CatalogSalesSalePrice[];
  startDate: string;
}

export interface LolStoreV1CatalogSalesSalePrice {
  cost: number;
  currency: string;
  discount: number;
}
