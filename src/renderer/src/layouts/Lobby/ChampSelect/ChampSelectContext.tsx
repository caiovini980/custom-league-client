import { createContext, PropsWithChildren, useContext } from 'react';
import {
  LolChampSelectV1Session,
  LolChampSelectV1SessionAction,
  LolChampSelectV1SessionTeam,
} from '@shared/typings/lol/response/lolChampSelectV1Session';
import { Undefined } from '@shared/typings/generic.typing';
import { Box } from '@mui/material';
import { useLeagueImage } from '@render/hooks/useLeagueImage';

type Actions = 'planning' | 'ban' | 'show-bans' | 'pick' | 'finalization';

interface ChampSelectContextState {
  gameMode: string;
  session: LolChampSelectV1Session;
  currentActionIndex: number;
  currentCellId: number;
  currentPlayer: LolChampSelectV1SessionTeam;
  currentAction: Actions;
  currentPlayerAction: Undefined<LolChampSelectV1SessionAction>;
  disabledChampionList: number[];
  bans: {
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
  const { loadChampionBackgroundImg } = useLeagueImage();

  const getCurrentActionIndex = () => {
    return session.actions.findIndex((al) => al.some((a) => !a.completed));
  };

  const getSummonerFromTeam = () => {
    const s = session.myTeam.find(
      (t) => t.cellId === session.localPlayerCellId,
    );
    if (!s) throw new Error('Player not found in team');
    return s;
  };

  const getAction = (): Actions => {
    if (!session.actions.length) {
      return 'finalization';
    }
    const { type } = session.actions[getCurrentActionIndex()][0];
    if (type === 'ten_bans_reveal') {
      return 'show-bans';
    }
    if (type === 'ban') {
      return 'ban';
    }
    if (type === 'pick') {
      return 'pick';
    }
    return 'planning';
  };

  const getCurrentPlayerAction = () => {
    return session.actions
      .flat()
      .find(
        (a) =>
          a.actorCellId === session.localPlayerCellId &&
          !a.completed &&
          a.isInProgress,
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
      myTeam,
      theirTeam,
    };
  };

  const getDisabledChampions = () => {
    return session.actions
      .flat()
      .filter((a) => a.championId > 0 && a.completed)
      .map((a) => a.championId);
  };

  const skinUrl = loadChampionBackgroundImg(
    'splashPath',
    getSummonerFromTeam().championId,
    getSummonerFromTeam().selectedSkinId,
  );

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
      }}
    >
      <Box
        height={'100%'}
        width={'100%'}
        display={'flex'}
        sx={{
          background: `linear-gradient(0deg, rgba(0,0,0,0.5) 10%, rgba(0,0,0,0) 100%), url(${skinUrl})`,
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
