import { useLeagueClientRequest } from '@render/hooks/useLeagueClientRequest';
import { useLeagueImage } from '@render/hooks/useLeagueImage';
import { useStore } from '@render/zustand/store';
import { useEffect, useState } from 'react';
import { LolChampionMasteryV1_Id_ChampionMastery } from '@shared/typings/lol/response/lolChampionMasteryV1_Id_ChampionMastery';
import { buildEventUrl } from '@render/hooks/useLeagueClientEvent';
import { Stack, Typography } from '@mui/material';
import { LoadingScreen } from '@render/components/LoadingScreen';
import { LazyImage } from '@render/components/LazyImage';

interface ChampionMostPlayerProps {
  puuid: string;
}

export const ChampionMostPlayer = ({ puuid }: ChampionMostPlayerProps) => {
  const { makeRequest } = useLeagueClientRequest();
  const { loadChampionBackgroundImg } = useLeagueImage();
  const champions = useStore().gameData.champions();

  const [championMastery, setChampionMastery] =
    useState<LolChampionMasteryV1_Id_ChampionMastery[]>();

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
    <Stack
      direction={'column'}
      width={280}
      height={'100%'}
      flexShrink={0}
      overflow={'auto'}
    >
      <LoadingScreen loading={!championMastery} height={'100%'} fullArea />
      {championMastery?.slice(0, 5).map((cm, i) => {
        return (
          <LazyImage
            key={cm.championId}
            src={loadChampionBackgroundImg('splashVideoPath', cm.championId)}
            background={(url) =>
              `linear-gradient(0deg, rgba(0,0,0,0.85) 20%, rgba(0,0,0,0) 100%), url(${url})`
            }
            sx={{
              width: '100%',
              height: '100%',
              minHeight: 80,
              backgroundSize: 'auto 250px',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: '0px -35px',
              p: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'start',
              justifyContent: 'center',
            }}
          >
            <Typography>#{i + 1}</Typography>
            <Typography>{getChampionName(cm.championId)}</Typography>
          </LazyImage>
        );
      })}
    </Stack>
  );
};
