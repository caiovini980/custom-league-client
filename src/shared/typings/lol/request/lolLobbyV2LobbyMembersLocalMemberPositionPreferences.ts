export type PositionPreference =
  | 'MIDDLE'
  | 'JUNGLE'
  | 'BOTTOM'
  | 'TOP'
  | 'UTILITY'
  | 'FILL'
  | 'UNSELECTED';

export interface LolLobbyV2LobbyMembersLocalMemberPositionPreferences {
  firstPreference: PositionPreference;
  secondPreference: PositionPreference;
}
