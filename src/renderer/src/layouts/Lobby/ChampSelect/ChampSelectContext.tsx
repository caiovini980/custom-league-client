import { Box } from '@mui/material';
import {
  ChampSelectionActions,
  useChampSelect,
} from '@render/hooks/useChampSelect';
import { useLeagueImage } from '@render/hooks/useLeagueImage';
import { Undefined } from '@shared/typings/generic.typing';
import {
  LolChampSelectV1Session,
  LolChampSelectV1SessionAction,
  LolChampSelectV1SessionTeam,
} from '@shared/typings/lol/response/lolChampSelectV1Session';
import { PropsWithChildren, createContext, useContext } from 'react';

interface ChampSelectContextState {
  gameMode: string;
  session: LolChampSelectV1Session;
  banPlayerActionId: number;
  pickPlayerActionId: number;
  isPlayerAction: boolean;
  currentActionIndex: number;
  currentCellId: number;
  currentPlayer: LolChampSelectV1SessionTeam;
  areSummonerActionsComplete: boolean;
  currentAction: ChampSelectionActions;
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
  const {
    summonerData,
    getCurrentPlayerAction,
    getCurrentActionIndex,
    getDisabledChampions,
    getBans,
    getPickPlayerActionId,
    getBanPlayerActionId,
    getAction,
    getSummonerSession,
  } = useChampSelect(session);

  const skinUrl = () => {
    const { selectedSkinId, championId, championPickIntent } =
      getSummonerSession();
    const { banIntentChampionId } = getBans();
    const action = getAction();

    if (action === 'ban') {
      if (banIntentChampionId !== 0) {
        return loadChampionBackgroundImg('splashPath', banIntentChampionId);
      }
    } else if (championId !== 0 || championPickIntent !== 0) {
      return loadChampionBackgroundImg(
        'splashPath',
        championId || championPickIntent,
        selectedSkinId,
      );
    }

    const gameModeParse: Record<string, string> = {
      ARAM: 'aram',
      CLASSIC: 'classic_sru',
    };

    const gameModePath = gameModeParse[gameMode] ?? 'classic_sru';

    return genericImg(
      `/plugins/rcp-be-lol-game-data/global/default/content/src/leagueclient/gamemodeassets/${gameModePath}/img/parties-background.jpg`,
    );
  };

  return (
    <context.Provider
      value={{
        session,
        currentActionIndex: getCurrentActionIndex(),
        currentCellId: session.localPlayerCellId,
        currentPlayer: getSummonerSession(),
        currentAction: getAction(),
        currentPlayerAction: getCurrentPlayerAction(),
        bans: getBans(),
        disabledChampionList: getDisabledChampions(),
        gameMode,
        banPlayerActionId: getBanPlayerActionId(),
        pickPlayerActionId: getPickPlayerActionId(),
        isPlayerAction: summonerData?.isActingNow ?? false,
        areSummonerActionsComplete:
          summonerData?.areSummonerActionsComplete ?? false,
      }}
    >
      <Box
        className={'theme-dark'}
        height={'100%'}
        width={'100%'}
        display={'flex'}
        sx={{
          background: `linear-gradient(0deg, rgba(0,0,0,0.8) 5%, rgba(0,0,0,0) 70%, rgba(0,0,0,0.8) 100%), url(${skinUrl()})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          color: 'var(--mui-palette-common-white)',
        }}
      >
        {children}
      </Box>
    </context.Provider>
  );
};
