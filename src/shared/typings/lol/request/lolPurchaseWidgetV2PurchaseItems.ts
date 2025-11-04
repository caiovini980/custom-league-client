export interface LolPurchaseWidgetV2PurchaseItems {
  items: LolPurchaseWidgetV2PurchaseItemsItem[];
}

export interface LolPurchaseWidgetV2PurchaseItemsItem {
  itemKey: {
    inventoryType: string;
    itemId: number;
  };
  purchaseCurrencyInfo: {
    currencyType: 'IP' | 'RP';
    price: number;
    purchasable: boolean;
  };
  source: string;
  featuredSection: string;
  quantity: number;
}
