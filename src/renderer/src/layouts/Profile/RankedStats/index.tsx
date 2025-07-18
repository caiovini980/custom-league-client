import { Stack } from '@mui/material';
import { buildEventUrl } from '@render/hooks/useLeagueClientEvent';
import { useLeagueClientRequest } from '@render/hooks/useLeagueClientRequest';
import { ChampionMostPlayer } from '@render/layouts/Profile/RankedStats/ChampionMostPlayer';
import { RankedQueueStats } from '@render/layouts/Profile/RankedStats/RankedQueueStats';
import { SummonerDetails } from '@render/layouts/Profile/RankedStats/SummonerDetails';
import { LolRankedV1RankedStats_Id } from '@shared/typings/lol/response/lolRankedV1RankedStats_Id';
import { LolSummonerV1Summoners_Id } from '@shared/typings/lol/response/lolSummonerV1Summoners_Id';
import { useEffect, useState } from 'react';

interface RankedStatsProps {
  summonerData: LolSummonerV1Summoners_Id;
}

export const RankedStats = ({ summonerData }: RankedStatsProps) => {
  const { makeRequest } = useLeagueClientRequest();

  const [rankedStats, setRankedStats] = useState<LolRankedV1RankedStats_Id>();

  useEffect(() => {
    makeRequest(
      'GET',
      buildEventUrl('/lol-ranked/v1/ranked-stats/{uuid}', summonerData.puuid),
      undefined,
    ).then((res) => {
      if (res.ok) {
        setRankedStats(res.body);
      }
    });
  }, []);

  return (
    <Stack
      className={'theme-dark'}
      position={'relative'}
      direction={'column'}
      alignItems={'center'}
      rowGap={1}
      p={2}
      width={'100%'}
      height={'100%'}
      overflow={'auto'}
      sx={{
        background:
          'linear-gradient(to bottom, transparent 15%, rgba(0,0,0,0.9) 55%)',
      }}
    >
      <Stack
        direction={'row'}
        height={'35%'}
        flexShrink={0}
        width={'100%'}
        alignItems={'center'}
        justifyContent={'flex-start'}
        sx={{
          borderBottom: '1px solid var(--mui-palette-divider)',
        }}
      >
        <SummonerDetails summoner={summonerData} />
      </Stack>
      <Stack
        direction={'row'}
        width={'100%'}
        flex={1}
        justifyContent={'flex-start'}
        columnGap={1}
        overflow={'auto'}
      >
        <ChampionMostPlayer puuid={summonerData.puuid} />
        {rankedStats && <RankedQueueStats stats={rankedStats} />}
      </Stack>
    </Stack>
  );
};
