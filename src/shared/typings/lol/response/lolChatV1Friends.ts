import { Null } from '@shared/typings/generic.typing';

export interface lolChatV1Friends {
  availability: 'dnd' | 'offline' | 'away' | 'chat';
  displayGroupId: number;
  displayGroupName: string;
  gameName: string;
  gameTag: string;
  groupId: number;
  groupName: string;
  icon: number;
  id: string;
  isP2PConversationMuted: boolean;
  lastSeenOnlineTimestamp: unknown;
  lol: Null<Lol>;
  name: string;
  note: string;
  patchline: string;
  pid: string;
  platformId: string;
  product: string;
  productName: string;
  puuid: string;
  statusMessage: string;
  summary: string;
  summonerId: number;
  time: number;
}

interface Lol {
  bannerIdSelected: string;
  challengeCrystalLevel: string;
  challengePoints: string;
  challengeTokensSelected: string;
  championId: string;
  companionId: string;
  damageSkinId: string;
  gameId: string;
  gameMode: string;
  gameQueueType: string;
  gameStatus: string;
  iconOverride: string;
  isObservable: string;
  legendaryMasteryScore: string;
  level: string;
  mapId: string;
  mapSkinId: string;
  playerTitleSelected: string;
  profileIcon: string;
  pty: string;
  puuid: string;
  queueId: string;
  rankedLeagueDivision: string;
  rankedLeagueQueue: string;
  rankedLeagueTier: string;
  rankedLosses: string;
  rankedPrevSeasonDivision: string;
  rankedPrevSeasonTier: string;
  rankedSplitRewardLevel: string;
  rankedWins: string;
  regalia: string;
  skinVariant: string;
  skinname: string;
  timeStamp: string;
}
