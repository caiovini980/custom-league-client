export interface LolYourShopV1Offers {
  id: string;
  championId: number;
  discountPrice: number;
  expirationDate: string;
  originalPrice: number;
  owned: boolean;
  purchasing: boolean;
  revealed: boolean;
  skinId: number;
  skinName: string;
  type: 'Skin';
}
