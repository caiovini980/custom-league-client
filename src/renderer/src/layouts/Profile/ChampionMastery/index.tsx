import { Grid, ListItemText, Stack, Typography } from '@mui/material';
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
import { LazyImage } from '@render/components/LazyImage';

interface ChampionMasteryProps {
  puuid: string;
}

export const ChampionMastery = ({ puuid }: ChampionMasteryProps) => {
  const { makeRequest } = useLeagueClientRequest();
  const { loadChampionBackgroundImg } = useLeagueImage();
  const { rcpFeLolSharedComponents, rcpFeLolParties } = useLeagueTranslate();
  const champions = useStore().gameData.champions();

  const [championMastery, setChampionMastery] =
    useState<LolChampionMasteryV1_Id_ChampionMastery[]>();

  const transChampionMastery = rcpFeLolSharedComponents(
    'trans-champion-mastery',
  );
  const rcpFeLolPartiesTrans = rcpFeLolParties('trans');

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
      <LoadingScreen loading={!championMastery} height={'100%'} fullArea />
      {championMastery?.map((cm, index) => (
        <LazyImage
          key={cm.championId}
          component={Grid}
          size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
          src={loadChampionBackgroundImg('tilePath', cm.championId)}
          background={(url) =>
            `linear-gradient(0deg, rgba(0,0,0,0.85) 20%, rgba(0,0,0,0) 100%), url(${url})`
          }
          sx={{
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: '0% 35%',
            p: 1,
          }}
        >
          <Stack direction={'column'} height={300} justifyContent={'flex-end'}>
            <ListItemText
              primary={`#${index + 1} ${getChampionName(cm.championId)} (${cm.highestGrade || 'N/A'})`}
              secondary={transChampionMastery(
                'cm_mastery_level',
                cm.championLevel,
              )}
              sx={{ flex: 0 }}
            />
            <Typography variant={'caption'}>
              {rcpFeLolPartiesTrans(
                'parties_point_eligibility_tooltip_masteries',
              )}
              : {formatCurrency(cm.championPoints, 0)}
            </Typography>
            <Typography variant={'caption'}>
              {formatDateTime(cm.lastPlayTime)}
            </Typography>
          </Stack>
        </LazyImage>
      ))}
    </Grid>
  );
};
