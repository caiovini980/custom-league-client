export interface LolPerksV1Styles {
  allowedSubStyles: number[];
  assetMap: LolPerksV1StylesAssetMap;
  defaultPageName: string;
  defaultPerks: number[];
  defaultSubStyle: number;
  iconPath: string;
  id: number;
  idName: string;
  name: string;
  slots: LolPerksV1StylesSlot[];
  subStyleBonus: LolPerksV1StylesSubStyleBonus[];
  tooltip: string;
}

export type LolPerksV1StylesAssetMap = {
  [key: `p${number}_s${number}_k${number}`]: string;
  svg_icon: string;
  svg_icon_16: string;
};

export interface LolPerksV1StylesSlot {
  perks: number[];
  slotLabel: string;
  type: string;
}

export interface LolPerksV1StylesSubStyleBonus {
  perkId: number;
  styleId: number;
}
