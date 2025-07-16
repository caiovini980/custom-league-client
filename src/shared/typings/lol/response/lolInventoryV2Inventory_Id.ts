export interface LolInventoryV2Inventory_Id {
  expirationDate: string;
  f2p: boolean;
  inventoryType: string;
  itemId: number;
  loyalty: boolean;
  loyaltySources: unknown[];
  owned: boolean;
  ownershipType: string;
  payload?: LolInventoryV2Inventory_IdPayload;
  purchaseDate: string;
  quantity: number;
  rental: boolean;
  usedInGameDate: string;
  uuid: string;
  wins: number;
}

export interface LolInventoryV2Inventory_IdPayload {}
