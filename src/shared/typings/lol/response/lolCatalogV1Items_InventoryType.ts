export interface LolCatalogV1Items_InventoryType {
  active: boolean;
  description: string;
  imagePath: string;
  inactiveDate: number;
  inventoryType: string;
  itemId: number;
  itemInstanceId: string;
  loadScreenPath: string;
  maxQuantity: number;
  metadata?: {
    type: string;
    value: string;
  }[];
  name: string;
  offerId: string;
  owned: boolean;
  ownershipType?: string;
  prices: {
    cost: number;
    costType: null;
    currency: 'IP' | 'RP';
    sale?: {
      cost: number;
      discount: number;
      endDate: string;
      startDate: string;
    };
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
}
