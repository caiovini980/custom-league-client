export interface LolActivityCenterV1Content_Id {
  analytics: LolActivityCenterV1Content_IdAnalytics;
  blades: LolActivityCenterV1Content_IdBlade[];
  id: string;
  locale: string;
  metaImage: LolActivityCenterV1Content_IdMetaImage;
  title: string;
  translationId: string;
  type: string;
}

export interface LolActivityCenterV1Content_IdAnalytics {
  contentId: string;
  contentLocale: string;
  publishDate: string;
  rev: string;
}

export interface LolActivityCenterV1Content_IdBlade {
  header?: LolActivityCenterV1Content_IdBladeHeader;
  items: LolActivityCenterV1Content_IdBladeItem[];
  mediaGalleryID: string;
  type: string;
}

export interface LolActivityCenterV1Content_IdBladeHeader {
  description: LolActivityCenterV1Content_IdBladeHeaderDescription;
  media: LolActivityCenterV1Content_IdBladeHeaderMedia;
  title: string;
  links: LolActivityCenterV1Content_IdHeaderLink[];
}

export interface LolActivityCenterV1Content_IdBladeHeaderDescription {
  type: string;
}

export interface LolActivityCenterV1Content_IdBladeHeaderMedia {
  accessibilityText?: string;
  colors: Colors;
  dimensions: Dimensions;
  mimeType: string;
  provider: string;
  type: string;
  url: string;
}

export interface Colors {
  label: string;
  primary: string;
  secondary: string;
}

export interface Dimensions {
  aspectRatio: number;
  height: number;
  width: number;
}

export interface LolActivityCenterV1Content_IdBladeItem {
  backdrop: LolActivityCenterV1Content_IdBladeItemBackdrop;
  header: LolActivityCenterV1Content_IdBladeItemHeader;
  mediaGalleryItemID?: string;
}

export interface LolActivityCenterV1Content_IdBladeItemBackdrop {
  background: LolActivityCenterV1Content_IdBladeItemBackdropBackground;
}

export interface LolActivityCenterV1Content_IdBladeItemBackdropBackground {
  dimensions: Dimensions2;
  provider: string;
  sources?: Source[];
  thumbnail?: Thumbnail;
  type: string;
  colors?: Colors3;
  mimeType?: string;
  url?: string;
}

export interface Dimensions2 {
  height: number;
  width: number;
  aspectRatio?: number;
}

export interface Source {
  src: string;
  type: string;
}

export interface Thumbnail {
  colors: Colors2;
  dimensions: Dimensions3;
  mimeType: string;
  provider: string;
  type: string;
  url: string;
}

export interface Colors2 {
  label: string;
  primary: string;
  secondary: string;
}

export interface Dimensions3 {
  aspectRatio: number;
  height: number;
  width: number;
}

export interface Colors3 {
  label: string;
  primary: string;
  secondary: string;
}

export interface LolActivityCenterV1Content_IdBladeItemHeader {
  description: Description2;
  links: LolActivityCenterV1Content_IdHeaderLink[];
  subtitle?: string;
  title: string;
  media?: Media3;
  supertitle?: string;
}

export interface Description2 {
  body: string;
  type: string;
}

export interface LolActivityCenterV1Content_IdHeaderLink {
  action: Action;
  displayType: string;
  title: string;
  media?: Media2;
}

export interface Action {
  payload: Payload;
  type: string;
}

export interface Payload {
  inventoryType?: string;
  itemId?: string;
  language?: string;
  title?: string;
  externalClientHooksEnabled?: boolean;
  iframeId?: string;
  iframeModalType?: string;
  url?: string;
  tabId?: string;
  items?: Item2[];
  page?: string;
  eventId?: string;
  openPassPurchase?: boolean;
  queueId?: number;
  pageId?: string;
}

export interface Item2 {
  inventoryType: string;
  itemId: string;
  language: string;
  title: string;
}

export interface Media2 {
  colors: Colors4;
  dimensions: Dimensions4;
  mimeType: string;
  provider: string;
  type: string;
  url: string;
}

export interface Colors4 {
  label: string;
  primary: string;
  secondary: string;
}

export interface Dimensions4 {
  aspectRatio: number;
  height: number;
  width: number;
}

export interface Media3 {
  colors: Colors5;
  dimensions: Dimensions5;
  mimeType: string;
  provider: string;
  type: string;
  url: string;
}

export interface Colors5 {
  label: string;
  primary: string;
  secondary: string;
}

export interface Dimensions5 {
  aspectRatio: number;
  height: number;
  width: number;
}

export interface LolActivityCenterV1Content_IdMetaImage {
  colors: Colors6;
  dimensions: Dimensions6;
  mimeType: string;
  provider: string;
  type: string;
  url: string;
}

export interface Colors6 {
  label: string;
  primary: string;
  secondary: string;
}

export interface Dimensions6 {
  aspectRatio: number;
  height: number;
  width: number;
}
