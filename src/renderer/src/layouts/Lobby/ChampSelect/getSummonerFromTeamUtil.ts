import { LolChampSelectV1Session } from '@shared/typings/lol/response/lolChampSelectV1Session';

export const getSummonerFromTeamUtil = (session: LolChampSelectV1Session) => {
  const s = session.myTeam.find((t) => t.cellId === session.localPlayerCellId);
  if (!s) throw new Error('Player not found in team');
  return s;
};
