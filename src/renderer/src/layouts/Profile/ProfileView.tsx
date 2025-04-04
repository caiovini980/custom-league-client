import { Avatar, Stack, Typography } from '@mui/material';
import {
  buildEventUrl,
  useLeagueClientEvent,
} from '@render/hooks/useLeagueClientEvent';
import { useLeagueImage } from '@render/hooks/useLeagueImage';
import { GameHistory } from '@render/layouts/Profile/GameHistory/GameHistory';
import { LolSummonerV1Summoners_Id } from '@shared/typings/lol/response/lolSummonerV1Summoners_Id';
import { useState } from 'react';

interface ProfileViewProps {
  summonerId: number;
}

export const ProfileView = ({ summonerId }: ProfileViewProps) => {
  const { profileIcon, lolGameDataImg } = useLeagueImage();

  const iconSize = 80;

  const [summonerData, setSummonerData] = useState<LolSummonerV1Summoners_Id>();
  const [backgroundUrl, setBackgroundUrl] = useState('');

  useLeagueClientEvent(
    buildEventUrl(
      '/lol-collections/v1/inventories/{digits}/backdrop',
      summonerId,
    ),
    (data) => {
      setBackgroundUrl(lolGameDataImg(data.backdropImage));
    },
  );

  useLeagueClientEvent(
    buildEventUrl('/lol-summoner/v1/summoners/{digits}', summonerId),
    (data) => {
      setSummonerData(data);
    },
  );

  if (!summonerData) return null;

  return (
    <Stack
      direction={'column'}
      height={'100%'}
      width={'100%'}
      alignItems={'center'}
      sx={{
        background: `linear-gradient(0deg, rgba(0,0,0,0.85) 40%, rgba(0,0,0,0) 100%), url(${backgroundUrl})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        pt: '30vh',
      }}
    >
      <Stack direction={'row'} width={'100%'} height={'100%'}>
        <Stack
          direction={'column'}
          alignItems={'center'}
          rowGap={2}
          width={'100%'}
          sx={{
            py: 3,
            px: 7,
          }}
        >
          <Avatar
            src={profileIcon(summonerData.profileIconId)}
            sx={{ width: iconSize, height: iconSize }}
          />
          <Typography>
            {summonerData.gameName} ({summonerData.summonerLevel})
          </Typography>
        </Stack>
        <GameHistory puuid={summonerData.puuid} />
      </Stack>
    </Stack>
  );
};
