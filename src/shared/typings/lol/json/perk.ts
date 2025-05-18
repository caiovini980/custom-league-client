export interface Perk {
  id: number;
  name: string;
  majorChangePatchVersion: string;
  tooltip: string;
  shortDesc: string;
  longDesc: string;
  recommendationDescriptor: string;
  iconPath: string;
  endOfGameStatDescs: string[];
  recommendationDescriptorAttributes: RecommendationDescriptorAttributes;
}

export type RecommendationDescriptorAttributes = {
  [key: `k${string}`]: number;
};
