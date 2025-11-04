import { ButtonBase, Paper, Stack, Typography } from '@mui/material';
import { CircularIcon } from '@render/components/CircularIcon';
import {
  buildEventUrl,
  useLeagueClientEvent,
} from '@render/hooks/useLeagueClientEvent';
import { useLeagueClientRequest } from '@render/hooks/useLeagueClientRequest';
import { useLeagueImage } from '@render/hooks/useLeagueImage';
import { champSelectStore } from '@render/zustand/stores/champSelectStore';
import { gameDataStore } from '@render/zustand/stores/gameDataStore';
import { useState } from 'react';

export const SubsetChampionPick = () => {
  const { loadChampionBackgroundImg, genericImg } = useLeagueImage();
  const { makeRequest } = useLeagueClientRequest();
  const areSummonerActionsComplete = champSelectStore.getCurrentSummonerData(
    (s) => s.areSummonerActionsComplete,
    false,
  );

  const pickPlayerActionId = champSelectStore.currentPickActionId.use();

  const [subsetChampion, setSubsetChampion] = useState<number[]>([81, 101]);

  const getChampionName = (championId: number) => {
    const champions = gameDataStore.champions.get();
    const champion = champions.find((c) => c.id === championId);
    if (champion) return champion;
    return null;
  };

  const onClickChampion = (championId: number) => {
    makeRequest(
      'PATCH',
      buildEventUrl(
        '/lol-champ-select/v1/session/actions/{digits}',
        pickPlayerActionId,
      ),
      {
        completed: true,
        championId,
      },
    ).then();
  };

  useLeagueClientEvent(
    '/lol-lobby-team-builder/champ-select/v1/subset-champion-list',
    (data) => {
      setSubsetChampion(data);
    },
  );

  if (areSummonerActionsComplete) return null;

  return (
    <Stack
      direction={'row'}
      height={'100%'}
      justifyContent={'space-evenly'}
      alignItems={'center'}
    >
      {subsetChampion.map((championId) => {
        const championData = getChampionName(championId);
        return (
          <Paper
            key={championId}
            component={ButtonBase}
            onClick={() => onClickChampion(championId)}
            sx={{
              width: 200,
              height: 300,
              background: `linear-gradient(0deg, rgba(0,0,0,0.6) 10%, rgba(0,0,0,0) 100%), url(${loadChampionBackgroundImg('splashPath', championId)})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              p: 2,
              '&:hover': {
                backgroundBlendMode: 'lighten',
              },
            }}
          >
            <CircularIcon
              src={genericImg(
                `/plugins/rcp-fe-lol-champ-select/global/default/class-icon-${championData?.roles[0]}.png`,
              )}
            />
            <Typography fontSize={'1.6rem'}>{championData?.name}</Typography>
            <Typography fontSize={'0.8rem'}>{championData?.title}</Typography>
          </Paper>
        );
      })}
    </Stack>
  );
};
