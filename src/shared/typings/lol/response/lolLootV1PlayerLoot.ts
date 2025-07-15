export interface LolLootV1PlayerLoot {
  asset: string;
  count: number;
  disenchantLootName: string;
  disenchantRecipeName: string;
  disenchantValue: number;
  displayCategories: 'SKIN' | 'SKIN_RENTAL' | 'CHAMPION' | 'CHAMPION_RENTAL';
  expiryTime: number;
  isNew: boolean;
  isRental: boolean;
  itemDesc: string;
  itemStatus: 'OWNED' | 'RENTAL ' | 'FREE' | 'NONE';
  localizedDescription: string;
  localizedName: string;
  localizedRecipeSubtitle: string;
  localizedRecipeTitle: string;
  lootId: string;
  lootName: string;
  parentItemStatus: string;
  parentStoreItemId: number;
  rarity: string;
  redeemableStatus:
    | 'SKIN_NOT_OWNED'
    | 'CHAMPION_NOT_OWNED'
    | 'ALREADY_RENTED'
    | 'ALREADY_OWNED'
    | 'NOT_REDEEMABLE_RENTAL'
    | 'NOT_REDEEMABLE'
    | 'REDEEMABLE_RENTAL'
    | 'REDEEMABLE'
    | 'UNKNOWN';
  refId: string;
  rentalGames: number;
  rentalSeconds: number;
  shadowPath: string;
  splashPath: string;
  storeItemId: number;
  tags: string;
  tilePath: string;
  type:
    | 'CURRENCY'
    | 'MATERIAL'
    | 'CHEST'
    | 'EMOTE'
    | 'SUMMONERICON'
    | 'STATSTONE'
    | 'STATSTONE_SHARD'
    | 'WARDSKIN'
    | 'WARDSKIN_RENTAL'
    | 'SKIN'
    | 'SKIN_RENTAL'
    | 'CHAMPION'
    | 'CHAMPION_RENTAL'
    | '';
  upgradeEssenceName: string;
  upgradeEssenceValue: number;
  upgradeLootName: string;
  value: number;
}
