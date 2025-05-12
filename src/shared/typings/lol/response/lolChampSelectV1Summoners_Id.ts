export interface LolChampSelectV1Summoners_Id {
  actingBackgroundAnimationState:
    | 'not-acting-background'
    | 'is-acting-background';
  activeActionType: '' | 'ban' | 'pick';
  areSummonerActionsComplete: boolean;
  assignedPosition: string;
  banIntentChampionId: number;
  cellId: number;
  championIconStyle: string;
  championId: number;
  championName: string;
  currentChampionVotePercentInteger: number;
  gameName: string;
  isActingNow: boolean;
  isDonePicking: boolean;
  isHumanoid: boolean;
  isOnPlayersTeam: boolean;
  isPickIntenting: boolean;
  isPlaceholder: boolean;
  isSelf: boolean;
  nameVisibilityType: 'VISIBLE' | 'HIDDEN';
  obfuscatedPuuid: string;
  obfuscatedSummonerId: number;
  pickSnipedClass: string;
  positionSwapId: number;
  puuid: string;
  shouldShowActingBar: boolean;
  shouldShowBanIntentIcon: boolean;
  shouldShowExpanded: boolean;
  shouldShowRingAnimations: boolean;
  shouldShowSelectedSkin: boolean;
  shouldShowSpells: boolean;
  showMuted: boolean;
  showPositionSwaps: boolean;
  showSwaps: boolean;
  showTrades: boolean;
  skinId: number;
  skinSplashPath: string;
  slotId: number;
  spell1IconPath: string;
  spell2IconPath: string;
  statusMessageKey: string;
  summonerId: number;
  swapId: number;
  tagLine: string;
  tradeId: number;
}
