import { Avatar, Card, CardHeader } from '@mui/material';
import { buildEventUrl } from '@render/hooks/useLeagueClientEvent';
import { useLeagueClientRequest } from '@render/hooks/useLeagueClientRequest';
import { useLeagueImage } from '@render/hooks/useLeagueImage';
import { LolSummonerV1Summoners_Id } from '@shared/typings/lol/response/lolSummonerV1Summoners_Id';
import { useEffect, useState } from 'react';

interface PlayerCardProps {
  summonerId: number;
}

export const PlayerCard = ({ summonerId }: PlayerCardProps) => {
  const { makeRequest } = useLeagueClientRequest();
  const { profileIcon } = useLeagueImage();

  const [summoner, setSummoner] = useState<LolSummonerV1Summoners_Id>();

  useEffect(() => {
    makeRequest(
      'GET',
      buildEventUrl('/lol-summoner/v1/summoners/{digits}', summonerId),
      undefined,
    ).then((res) => {
      if (res.ok) {
        setSummoner(res.body);
      }
    });
  }, [summonerId]);

  return (
    <Card sx={{ width: 200 }}>
      <CardHeader
        avatar={<Avatar src={profileIcon(summoner?.profileIconId)} />}
        title={summoner?.gameName}
        subheader={summoner?.summonerLevel}
      />
    </Card>
  );
};
