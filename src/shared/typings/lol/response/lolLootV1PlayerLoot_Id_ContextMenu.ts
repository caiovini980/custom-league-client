export interface LolLootV1PlayerLoot_Id_ContextMenu {
  actionType:
    | 'DISENCHANT'
    | 'UPGRADE'
    | 'REROLL'
    | 'OPEN'
    | 'purchase_champion'
    | 'redeem';
  enabled: boolean;
  essenceQuantity: number;
  essenceType: string;
  name: string;
  recipeContextMenuAction: string;
  recipeDescription: string;
  requiredOthers: string;
  requiredOthersCount: number;
  requiredOthersName: string;
  requiredTokens: string;
}
