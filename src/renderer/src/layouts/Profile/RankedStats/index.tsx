import { Divider, Stack, Typography } from '@mui/material';
import { buildEventUrl } from '@render/hooks/useLeagueClientEvent';
import { useLeagueClientRequest } from '@render/hooks/useLeagueClientRequest';
import { useLeagueImage } from '@render/hooks/useLeagueImage';
import { RankedQueueStats } from '@render/layouts/Profile/RankedStats/RankedQueueStats';
import { LolRankedV1RankedStats_Id } from '@shared/typings/lol/response/lolRankedV1RankedStats_Id';
import { LolSummonerV1Summoners_Id } from '@shared/typings/lol/response/lolSummonerV1Summoners_Id';
import { useEffect, useState } from 'react';
import { CircularIcon } from '@render/components/CircularIcon';

interface RankedStatsProps {
  summonerData: LolSummonerV1Summoners_Id;
}

export const RankedStats = ({ summonerData }: RankedStatsProps) => {
  const { profileIcon } = useLeagueImage();
  const { makeRequest } = useLeagueClientRequest();

  const iconSize = 80;

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
      direction={'column'}
      alignItems={'center'}
      rowGap={1}
      width={650}
      sx={{
        py: 3,
        px: 7,
      }}
    >
      <CircularIcon
        src={profileIcon(summonerData.profileIconId)}
        size={iconSize}
      />
      <Typography>{summonerData.gameName}</Typography>
      <Typography>({summonerData.summonerLevel})</Typography>
      <Divider orientation={'horizontal'} flexItem />
      {rankedStats && <RankedQueueStats stats={rankedStats} />}
    </Stack>
  );
};
