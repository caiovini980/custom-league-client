export interface PerkStyles {
  allowedSubStyles: number[];
  assetMap: PerkStylesAssetMap;
  defaultPageName: string;
  defaultPerks: number[];
  defaultSubStyle: number;
  iconPath: string;
  id: number;
  idName: string;
  name: string;
  slots: PerkStylesSlot[];
  subStyleBonus: PerkStylesSubStyleBonus[];
  tooltip: string;
}

export type PerkStylesAssetMap = {
  [key: `p${number}_s${number}_k${number}`]: string;
  svg_icon: string;
  svg_icon_16: string;
};

export interface PerkStylesSlot {
  perks: number[];
  slotLabel: string;
  type: string;
}

export interface PerkStylesSubStyleBonus {
  perkId: number;
  styleId: number;
}
