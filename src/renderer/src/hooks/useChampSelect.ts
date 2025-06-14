import { useEffect, useState } from 'react';
import { LolChampSelectV1Summoners_Id } from '@shared/typings/lol/response/lolChampSelectV1Summoners_Id';
import {
  buildEventUrl,
  onLeagueClientEvent,
} from '@render/hooks/useLeagueClientEvent';
import {
  LolChampSelectV1Session,
  LolChampSelectV1SessionTeam,
} from '@shared/typings/lol/response/lolChampSelectV1Session';

export type ChampSelectionActions =
  | 'planning'
  | 'ban'
  | 'show-bans'
  | 'pick'
  | 'finalization'
  | 'my-team-pick'
  | 'enemy-team-pick';

export const useChampSelect = (session: LolChampSelectV1Session) => {
  const [summonersData, setSummonersData] = useState<
    Record<number, LolChampSelectV1Summoners_Id>
  >({});

  const summonerData = summonersData[session.localPlayerCellId];

  const getSlotId = () => {
    const player = getSummonerSession();
    if (session.isLegacyChampSelect) return -1;
    return player.team === 1 ? player.cellId : player.cellId - 5;
  };

  const getCurrentActionIndex = () => {
    return session.actions.findIndex((al) => al.some((a) => !a.completed));
  };

  const getSummonerSession = () => {
    const s = session.myTeam.find(
      (t) => t.cellId === session.localPlayerCellId,
    );
    if (!s) {
      return {
        selectedSkinId: 0,
        championId: 0,
        championPickIntent: 0,
      } as LolChampSelectV1SessionTeam;
    }
    return s;
  };

  const getAction = (): ChampSelectionActions => {
    if (summonerData?.areSummonerActionsComplete) {
      return 'finalization';
    }
    if (session.timer.phase === 'PLANNING') {
      return 'planning';
    }

    if (session.timer.phase === 'FINALIZATION') {
      return 'finalization';
    }

    const actions = session.actions
      .filter((as) => as.some((a) => !a.completed && a.isInProgress))
      .flat();
    if (!session.actions.length || !actions.length) {
      return 'finalization';
    }

    const { type, isAllyAction } = actions[0];

    if (type === 'ten_bans_reveal') {
      return 'show-bans';
    }
    if (type === 'ban') {
      return 'ban';
    }
    if (type === 'pick') {
      if (!isAllyAction) return 'enemy-team-pick';
      if (actions.some((a) => a.actorCellId === session.localPlayerCellId)) {
        return 'pick';
      }
      return 'my-team-pick';
    }
    return 'finalization';
  };

  const getCurrentPlayerAction = () => {
    return session.actions
      .flat()
      .find((a) => a.actorCellId === session.localPlayerCellId && !a.completed);
  };

  const getBanPlayerActionId = () => {
    return (
      session.actions
        .flat()
        .find(
          (a) =>
            a.actorCellId === session.localPlayerCellId &&
            a.type === 'ban' &&
            !a.completed,
        )?.id ?? -1
    );
  };

  const getPickPlayerActionId = () => {
    return (
      session.actions
        .flat()
        .find(
          (a) =>
            a.actorCellId === session.localPlayerCellId &&
            a.type === 'pick' &&
            !a.completed,
        )?.id ?? -1
    );
  };

  const getBans = () => {
    const actionBans = session.actions.flat().filter((a) => a.type === 'ban');
    const myTeam: number[] = [];
    const theirTeam: number[] = [];

    actionBans.forEach((a) => {
      if (a.isAllyAction) {
        myTeam.push(a.championId);
      } else {
        theirTeam.push(a.championId);
      }
    });

    return {
      banIntentChampionId: summonerData?.banIntentChampionId ?? 0,
      myTeam,
      theirTeam,
    };
  };

  const getDisabledChampions = () => {
    return session.actions
      .flat()
      .filter((a) => a.type === 'ban' && a.championId > 0 && a.completed)
      .map((a) => a.championId);
  };

  const getSummonerData = (cellId: number) => summonersData[cellId];

  useEffect(() => {
    const amountPlayer = session.theirTeam.length + session.myTeam.length;

    const summonerDataList = new Array(amountPlayer).fill(0).map((_, i) => {
      const cellId = i + 1;
      return onLeagueClientEvent(
        buildEventUrl('/lol-champ-select/v1/summoners/{digits}', cellId),
        (data) => {
          setSummonersData((prev) =>
            Object.assign(prev, {
              [cellId]: data,
            }),
          );
        },
        false,
      );
    });

    return () => {
      summonerDataList.forEach((sd) => {
        sd.unsubscribe();
      });
    };
  }, []);

  return {
    getAction,
    getBans,
    getBanPlayerActionId,
    getPickPlayerActionId,
    getSlotId,
    getDisabledChampions,
    getCurrentActionIndex,
    getCurrentPlayerAction,
    getSummonerSession,
    getSummonerData,
    summonersData,
    summonerData,
  };
};
