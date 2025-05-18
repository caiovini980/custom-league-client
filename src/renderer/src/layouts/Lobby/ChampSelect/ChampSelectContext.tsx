import { createContext, PropsWithChildren, useContext, useState } from 'react';
import {
  LolChampSelectV1Session,
  LolChampSelectV1SessionAction,
  LolChampSelectV1SessionTeam,
} from '@shared/typings/lol/response/lolChampSelectV1Session';
import { Undefined } from '@shared/typings/generic.typing';
import { Box } from '@mui/material';
import { useLeagueImage } from '@render/hooks/useLeagueImage';
import {
  buildEventUrl,
  useLeagueClientEvent,
} from '@render/hooks/useLeagueClientEvent';
import { LolChampSelectV1Summoners_Id } from '@shared/typings/lol/response/lolChampSelectV1Summoners_Id';

type Actions = 'planning' | 'ban' | 'show-bans' | 'pick' | 'finalization';

interface ChampSelectContextState {
  gameMode: string;
  session: LolChampSelectV1Session;
  banPlayerActionId: number;
  pickPlayerActionId: number;
  isPlayerAction: boolean;
  currentActionIndex: number;
  currentCellId: number;
  currentPlayer: LolChampSelectV1SessionTeam;
  currentAction: Actions;
  currentPlayerAction: Undefined<LolChampSelectV1SessionAction>;
  disabledChampionList: number[];
  bans: {
    banIntentChampionId: number;
    myTeam: number[];
    theirTeam: number[];
  };
}

const context = createContext<ChampSelectContextState>(
  {} as ChampSelectContextState,
);

export const useChampSelectContext = () => useContext(context);

interface ChampSelectContextProps {
  session: LolChampSelectV1Session;
  gameMode: string;
}

export const ChampSelectContext = ({
  session,
  gameMode,
  children,
}: PropsWithChildren<ChampSelectContextProps>) => {
  const { loadChampionBackgroundImg, genericImg } = useLeagueImage();

  const [summonerData, setSummonerData] =
    useState<LolChampSelectV1Summoners_Id>();

  useLeagueClientEvent(
    buildEventUrl('/lol-champ-select/v1/summoners/{digits}', getSlotId()),
    (data) => {
      setSummonerData(data);
    },
    {
      deps: [session.localPlayerCellId],
    },
  );

  function getSlotId() {
    const player = getSummonerFromTeam();
    return player.team === 1 ? player.cellId : player.cellId - 5;
  }

  const getCurrentActionIndex = () => {
    return session.actions.findIndex((al) => al.some((a) => !a.completed));
  };

  function getSummonerFromTeam() {
    const s = session.myTeam.find(
      (t) => t.cellId === session.localPlayerCellId,
    );
    if (!s) throw new Error('Player not found in team');
    return s;
  }

  const getAction = (): Actions => {
    if (summonerData?.areSummonerActionsComplete) {
      return 'finalization';
    }
    if (session.timer.phase === 'PLANNING') {
      return 'planning';
    }

    if (session.timer.phase === 'FINALIZATION') {
      return 'finalization';
    }

    const action = getCurrentPlayerAction();
    if (!session.actions.length || !action) {
      return 'finalization';
    }

    const { type } = action;
    if (type === 'ten_bans_reveal') {
      return 'show-bans';
    }
    if (type === 'ban') {
      return 'ban';
    }
    if (type === 'pick') {
      return 'pick';
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

  const getBans = (): ChampSelectContextState['bans'] => {
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

  const skinUrl = () => {
    const { selectedSkinId, championId, championPickIntent } =
      getSummonerFromTeam();
    const { banIntentChampionId } = getBans();
    const action = getAction();

    if (action === 'ban') {
      return loadChampionBackgroundImg('splashPath', banIntentChampionId);
    }

    if (championId !== 0 || championPickIntent !== 0) {
      return loadChampionBackgroundImg(
        'splashPath',
        championId || championPickIntent,
        selectedSkinId,
      );
    }

    return genericImg(
      '/plugins/rcp-be-lol-game-data/global/default/content/src/leagueclient/gamemodeassets/classic_sru/img/champ-select-planning-intro.jpg',
    );
  };

  if (!summonerData) return null;

  return (
    <context.Provider
      value={{
        session,
        currentActionIndex: getCurrentActionIndex(),
        currentCellId: session.localPlayerCellId,
        currentPlayer: getSummonerFromTeam(),
        currentAction: getAction(),
        currentPlayerAction: getCurrentPlayerAction(),
        bans: getBans(),
        disabledChampionList: getDisabledChampions(),
        gameMode,
        banPlayerActionId: getBanPlayerActionId(),
        pickPlayerActionId: getPickPlayerActionId(),
        isPlayerAction: summonerData.isActingNow,
      }}
    >
      <Box
        height={'100%'}
        width={'100%'}
        display={'flex'}
        sx={{
          background: `linear-gradient(0deg, rgba(0,0,0,0.8) 5%, rgba(0,0,0,0) 70%, rgba(0,0,0,0.8) 100%), url(${skinUrl()})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        }}
      >
        {children}
      </Box>
    </context.Provider>
  );
};
