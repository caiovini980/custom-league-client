import {
  Avatar,
  Grid,
  ListItemAvatar,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import { LoadingScreen } from '@render/components/LoadingScreen';
import { buildEventUrl } from '@render/hooks/useLeagueClientEvent';
import { useLeagueClientRequest } from '@render/hooks/useLeagueClientRequest';
import { useLeagueImage } from '@render/hooks/useLeagueImage';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import { useStore } from '@render/zustand/store';
import { LolChampionMasteryV1_Id_ChampionMastery } from '@shared/typings/lol/response/lolChampionMasteryV1_Id_ChampionMastery';
import { formatDateTime } from '@shared/utils/date.util';
import { formatCurrency } from '@shared/utils/string.util';
import { useEffect, useState } from 'react';

interface ChampionMasteryProps {
  puuid: string;
}

export const ChampionMastery = ({ puuid }: ChampionMasteryProps) => {
  const { makeRequest } = useLeagueClientRequest();
  const { championIcon, loadChampionBackgroundImg } = useLeagueImage();
  const { rcpFeLolSharedComponents, rcpFeLolMatchHistory } =
    useLeagueTranslate();
  const champions = useStore().gameData.champions();

  const [championMastery, setChampionMastery] =
    useState<LolChampionMasteryV1_Id_ChampionMastery[]>();

  const transChampionMastery = rcpFeLolSharedComponents(
    'trans-champion-mastery',
  );
  rcpFeLolMatchHistory('trans');

  const getChampionName = (id: number) => {
    return champions.find((c) => c.id === id)?.name ?? '';
  };

  useEffect(() => {
    makeRequest(
      'GET',
      buildEventUrl('/lol-champion-mastery/v1/{uuid}/champion-mastery', puuid),
      undefined,
    ).then((res) => {
      if (res.ok) {
        setChampionMastery(res.body);
      }
    });
  }, [puuid]);

  return (
    <Grid container spacing={2} sx={{ overflow: 'auto' }}>
      <LoadingScreen
        loading={!championMastery}
        height={'100%'}
        loadingText={'Loading mastery...'}
        fullArea
      />
      {championMastery?.map((cm, index) => (
        <Grid
          key={cm.championId}
          size={{ xs: 3 }}
          sx={{
            background: `linear-gradient(0deg, rgba(0,0,0,0.85) 60%, rgba(0,0,0,0) 100%), url(${loadChampionBackgroundImg('loadScreenPath', cm.championId)})`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: '0% 15%',
            p: 1,
          }}
        >
          <ListItemAvatar>
            <Avatar src={championIcon(cm.championId)} />
          </ListItemAvatar>
          <Stack direction={'column'}>
            <ListItemText
              primary={`#${index + 1} ${getChampionName(cm.championId)} (${cm.highestGrade || 'N/A'})`}
              secondary={transChampionMastery(
                'cm_mastery_level',
                cm.championLevel,
              )}
            />
            <Typography variant={'caption'}>
              Champion Points: {formatCurrency(cm.championPoints, 0)}
            </Typography>
            <Typography variant={'caption'}>
              Last Play Time: {formatDateTime(cm.lastPlayTime)}
            </Typography>
          </Stack>
        </Grid>
      ))}
    </Grid>
  );
};
