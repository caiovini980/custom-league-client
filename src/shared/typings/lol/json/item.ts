export interface Item {
  id: number;
  name: string;
  description: string;
  active: boolean;
  inStore: boolean;
  from: unknown[];
  to: number[];
  categories: string[];
  maxStacks: number;
  requiredChampion: string;
  requiredAlly: string;
  requiredBuffCurrencyName: string;
  requiredBuffCurrencyCost: number;
  specialRecipe: number;
  isEnchantment: boolean;
  price: number;
  priceTotal: number;
  displayInItemSets: boolean;
  iconPath: string;
}
