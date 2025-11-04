export interface LolPurchaseWidgetV1PurchasableItem {
  bundledItems: unknown[];
  dependencies: {
    assets: {
      colors: unknown[];
      emblems: unknown[];
      iconPath: string;
      previewVideoUrl: string;
      splashPath: string;
      tilePath: string;
    };
    bundledItemPrice: null;
    description: string;
    hasVisibleLootOdds: boolean;
    imagePath: string;
    inventoryType: string;
    itemId: number;
    loyaltyUnlocked: boolean;
    metadata: unknown[];
    name: string;
    owned: boolean;
    subInventoryType: string;
    subTitle: string;
    tags: string[];
  }[];
  item: {
    assets: {
      colors: unknown[];
      emblems: unknown[];
      iconPath: string;
      previewVideoUrl: string;
      splashPath: string;
      tilePath: string;
    };
    bundledItemPrice: null;
    description: string;
    hasVisibleLootOdds: boolean;
    imagePath: string;
    inventoryType: string;
    inactiveDate?: number;
    itemId: number;
    loyaltyUnlocked: boolean;
    metadata: {
      type: string;
      value: string;
    }[];
    name: string;
    owned: boolean;
    subInventoryType: string;
    subTitle: string;
    tags: string[];
  };
  purchaseOptions: {
    priceDetails: {
      itemKey: {
        inventoryType: string;
        itemId: number;
      };
      price: {
        currencyType: 'RP' | 'IP';
        price: number;
        purchasable: boolean;
      };
    }[];
  }[];
  sale: {
    discount: number;
    startDate: string;
    endDate: string;
  } | null;
  validationErrors: {
    id: string;
  }[];
}
