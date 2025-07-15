import {
  buildEventUrl,
  onLeagueClientEvent,
} from '@render/hooks/useLeagueClientEvent';
import { useLeagueClientRequest } from '@render/hooks/useLeagueClientRequest';
import {
  LolChampSelectV1Session,
  LolChampSelectV1SessionTeam,
} from '@shared/typings/lol/response/lolChampSelectV1Session';
import { LolChampSelectV1Summoners_Id } from '@shared/typings/lol/response/lolChampSelectV1Summoners_Id';
import { useEffect, useState } from 'react';

export type ChampSelectionActions =
  | 'planning'
  | 'ban'
  | 'show-bans'
  | 'pick'
  | 'finalization'
  | 'my-team-pick'
  | 'enemy-team-pick';

export const useChampSelect = (session: LolChampSelectV1Session) => {
  const { makeRequest } = useLeagueClientRequest();

  const [summonersData, setSummonersData] = useState<
    Record<number, LolChampSelectV1Summoners_Id>
  >({});

  const getSummonerData = (
    cellId: number,
  ): undefined | LolChampSelectV1Summoners_Id => summonersData[cellId];

  const summonerData = () => getSummonerData(getSlotId());

  const getSlotId = () => {
    return session.myTeam.findIndex(
      (t) => t.cellId === session.localPlayerCellId,
    );
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
    if (summonerData()?.areSummonerActionsComplete) {
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
      banIntentChampionId: summonerData()?.banIntentChampionId ?? 0,
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

  useEffect(() => {
    const amountPlayer = session.theirTeam.length + session.myTeam.length;

    const summonerDataList = new Array(amountPlayer).fill(0).map((_, i) => {
      const slotId = i;
      const url = buildEventUrl(
        '/lol-champ-select/v1/summoners/{digits}',
        slotId,
      );
      makeRequest('GET', url, undefined).then((res) => {
        if (res.ok) {
          setSummonersData((prev) => ({
            ...prev,
            [slotId]: res.body,
          }));
        }
      });
      return onLeagueClientEvent(
        url,
        (data) => {
          setSummonersData((prev) => ({
            ...prev,
            [slotId]: data,
          }));
        },
        false,
      );
    });

    return () => {
      summonerDataList.forEach((sd) => {
        sd.unsubscribe();
      });
    };
  }, [session.theirTeam.length + session.myTeam.length]);

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
    summonerData: summonerData(),
  };
};
