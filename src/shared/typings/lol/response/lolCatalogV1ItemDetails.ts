export interface LolCatalogV1ItemDetails {
  assets: {
    colors: unknown[];
    emblems: unknown[];
    iconPath: string;
    loadScreenPath: string;
    previewVideoUrl: string;
    splashPath: string;
    tilePath: string;
  };
  bundleFinalPrice: number;
  bundledDiscountPrices: null;
  bundledItems: null;
  flexible: boolean;
  item: {
    active: boolean;
    description: string;
    imagePath: string;
    inactiveDate: number;
    inventoryType: string;
    itemId: number;
    itemInstanceId: string;
    loadScreenPath: string;
    maxQuantity: number;
    metadata: {
      type: string;
      value: string;
    }[];
    name: string;
    offerId: string;
    owned: boolean;
    ownershipType: null;
    prices: {
      cost: number;
      costType: null;
      currency: 'IP' | 'RP';
      sale: {
        rp: number;
        percentOff: number;
        endDate: string;
      } | null;
    }[];
    purchaseDate: number;
    questSkinInfo: null;
    rarity: string;
    releaseDate: number;
    sale: {
      rp: number;
      percentOff: number;
      endDate: string;
    } | null;
    subInventoryType: string;
    subTitle: string;
    taggedChampionsIds: number[];
    tags: string[];
    tilePath: string;
  };
  metadata: {
    type: string;
    value: string;
  }[];
  minimumBundlePrices: null;
  quantity: number;
  requiredItems: {
    assets: {
      colors: unknown[];
      emblems: unknown[];
      iconPath: string;
      loadScreenPath: string;
      previewVideoUrl: string;
      splashPath: string;
      tilePath: string;
    }[];
    bundleFinalPrice: number;
    bundledDiscountPrices: null;
    bundledItems: null;
    flexible: boolean;
    item: {
      active: boolean;
      description: string;
      imagePath: string;
      inactiveDate: number;
      inventoryType: string;
      itemId: number;
      itemInstanceId: string;
      loadScreenPath: string;
      maxQuantity: number;
      metadata: null;
      name: string;
      offerId: string;
      owned: boolean;
      ownershipType: null;
      prices: {
        cost: number;
        costType: null;
        currency: string;
        sale: null;
      }[];
      purchaseDate: number;
      questSkinInfo: null;
      rarity: string;
      releaseDate: number;
      sale: null;
      subInventoryType: string;
      subTitle: string;
      taggedChampionsIds: number[];
      tags: string[];
      tilePath: string;
    };
    metadata: unknown[];
    minimumBundlePrices: null;
    quantity: number;
    requiredItems: null;
  };
}
