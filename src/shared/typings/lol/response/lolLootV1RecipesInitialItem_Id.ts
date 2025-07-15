export interface LolLootV1RecipesInitialItem_Id {
  contextMenuText: string;
  crafterName: string;
  description: string;
  displayCategories: string;
  hasVisibleLootOdds: boolean;
  imagePath: string;
  introVideoPath: string;
  loopVideoPath: string;
  lootMilestoneIds: unknown[];
  metadata: LolLootV1RecipesInitialItem_IdMetadata;
  outputs: unknown[];
  outroVideoPath: string;
  recipeName: string;
  requirementText: string;
  singleOpen: boolean;
  slots: LolLootV1RecipesInitialItem_IdSlot[];
  type: string;
}

export interface LolLootV1RecipesInitialItem_IdMetadata {
  bonusDescriptions: unknown[];
  guaranteedDescriptions: unknown[];
  tooltipsDisabled: boolean;
}

export interface LolLootV1RecipesInitialItem_IdSlot {
  lootIds: string[];
  quantity: number;
  slotNumber: number;
  tags: string;
}
