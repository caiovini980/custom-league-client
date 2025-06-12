import { Box, Collapse, ListItem, Stack } from '@mui/material';
import {
  CustomIconButton,
  CustomIconButtonTooltip,
  CustomIconButtonTooltipProps,
} from '@render/components/input';
import {
  buildEventUrl,
  useLeagueClientEvent,
} from '@render/hooks/useLeagueClientEvent';
import { useLeagueClientRequest } from '@render/hooks/useLeagueClientRequest';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import { LolMatchHistoryV1productsLol_Id_Matches } from '@shared/typings/lol/response/lolMatchHistoryV1ProductsLol_Id_Matches';
import { LolReplaysV1Metadata_Id } from '@shared/typings/lol/response/lolReplaysV1Metadata_Id';
import { useEffect, useState } from 'react';
import {
  FaChevronDown,
  FaChevronUp,
  FaDownload,
  FaPlay,
} from 'react-icons/fa6';
import { GenericGameHistoryItem } from '@render/layouts/Profile/GameHistory/GenericGameHistoryItem';
import { LolMatchHistoryV1Games_Id } from '@shared/typings/lol/response/lolMatchHistoryV1Games_Id';
import { TeamHistory } from '@render/layouts/Profile/GameHistory/TeamHistory';
import { storeValues } from '@render/zustand/store';

interface GameHistoryItemProps {
  puuid: string;
  game: LolMatchHistoryV1productsLol_Id_Matches['games']['games'][number];
}

export const GameHistoryItem = ({ game, puuid }: GameHistoryItemProps) => {
  const { makeRequest } = useLeagueClientRequest();
  const { rcpFeLolSharedComponents } = useLeagueTranslate();

  const transReplays = rcpFeLolSharedComponents('trans-replays');

  const [showMoreDetail, setShowMoreDetail] = useState(false);
  const [replayState, setReplayState] = useState<LolReplaysV1Metadata_Id>({
    downloadProgress: -1,
    gameId: -1,
    state: 'incompatible',
  });
  const [gameData, setGameData] = useState<LolMatchHistoryV1Games_Id>();

  const replayBtn = (): CustomIconButtonTooltipProps => {
    const iconSize = 16;

    const title = transReplays(
      `replays_button_default_tooltip_${replayState.state}`,
    );
    if (replayState.state === 'download') {
      return {
        title,
        children: <FaDownload size={iconSize} />,
        onClick: () => {
          makeRequest(
            'POST',
            buildEventUrl(
              '/lol-replays/v1/rofls/{digits}/download',
              game.gameId,
            ),
            {
              componentType: '',
            },
          ).then((res) => {
            if (res.ok) {
              loadReplayData();
            }
          });
        },
      };
    }
    if (['downloading', 'found'].includes(replayState.state)) {
      return {
        children: <FaDownload size={iconSize} />,
        title,
        disabled: true,
        loading: true,
      };
    }
    if (replayState.state === 'watch') {
      return {
        children: <FaPlay size={iconSize} />,
        title,
        onClick: () =>
          makeRequest(
            'POST',
            buildEventUrl('/lol-replays/v1/rofls/{digits}/watch', game.gameId),
            {
              componentType: '',
            },
          ),
      };
    }

    return {
      children: <FaDownload size={iconSize} />,
      title,
      disabled: true,
    };
  };

  const getCurrentParticipantId = () => {
    return (
      gameData?.participantIdentities.find((p) => p.player.puuid === puuid)
        ?.participantId ?? -1
    );
  };

  useLeagueClientEvent(
    buildEventUrl('/lol-match-history/v1/games/{digits}', game.gameId),
    (data) => {
      setGameData(data);
    },
  );

  useLeagueClientEvent(
    buildEventUrl('/lol-replays/v1/metadata/{digits}', game.gameId),
    (data) => {
      setReplayState(data);
    },
  );

  const loadReplayData = async () => {
    const res = await makeRequest(
      'GET',
      buildEventUrl('/lol-replays/v1/metadata/{digits}', game.gameId),
      undefined,
    );
    if (res.ok) return;
    await makeRequest(
      'POST',
      buildEventUrl('/lol-replays/v2/metadata/{digits}/create', game.gameId),
      {},
    );
  };

  const showReplayBtn = () => {
    return storeValues.currentSummoner.info()?.puuid === puuid;
  };

  useEffect(() => {
    loadReplayData().then();
  }, [game.gameId]);

  if (!gameData) return null;

  return (
    <ListItem
      sx={{
        p: 0,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <GenericGameHistoryItem
        game={gameData}
        participantId={getCurrentParticipantId()}
      >
        <Box
          position={'absolute'}
          width={4}
          height={showMoreDetail ? '100%' : 0}
          left={0}
          bottom={0}
          bgcolor={'white'}
          sx={{
            transition: (t) => t.transitions.create('height'),
          }}
        />
        <Stack
          direction={'column'}
          justifyContent={'center'}
          display={showReplayBtn() ? 'flex' : 'none'}
        >
          <CustomIconButtonTooltip
            placement={'right'}
            disableInteractive
            sx={{
              '& .MuiCircularProgress-root': {
                color: 'white',
              },
            }}
            {...replayBtn()}
          />
        </Stack>
        <Stack direction={'column'} justifyContent={'center'}>
          <CustomIconButton onClick={() => setShowMoreDetail(!showMoreDetail)}>
            {showMoreDetail ? (
              <FaChevronUp size={15} />
            ) : (
              <FaChevronDown size={15} />
            )}
          </CustomIconButton>
        </Stack>
      </GenericGameHistoryItem>
      <Collapse
        in={showMoreDetail}
        mountOnEnter
        sx={{
          width: '100%',
        }}
      >
        <Stack direction={'column'} p={2} borderLeft={'4px solid white'}>
          <TeamHistory game={gameData} teamIndex={1} />
          <TeamHistory game={gameData} teamIndex={2} />
        </Stack>
      </Collapse>
    </ListItem>
  );
};
