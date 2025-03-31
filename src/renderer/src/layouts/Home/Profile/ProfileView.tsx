import { Avatar, Stack, Typography } from '@mui/material';
import {
  buildEventUrl,
  useLeagueClientEvent,
} from '@render/hooks/useLeagueClientEvent';
import { useLeagueImage } from '@render/hooks/useLeagueImage';
import { useElectronHandle } from '@render/utils/electronFunction.util';
import { SummonerGetSummonerByIdResponse } from '@shared/typings/ipc-function/handle/summoner.typing';
import { useEffect, useState } from 'react';

interface ProfileViewProps {
  summonerId: number;
}

export const ProfileView = ({ summonerId }: ProfileViewProps) => {
  const { profileIcon, lolGameDataImg } = useLeagueImage();
  const { summoner } = useElectronHandle();

  const iconSize = 80;

  const [summonerData, setSummonerData] =
    useState<SummonerGetSummonerByIdResponse>();
  const [backgroundUrl, setBackgroundUrl] = useState('');

  useEffect(() => {
    summoner.getSummonerById(summonerId).then((data) => {
      setSummonerData(data);
    });
  }, [summonerId]);

  useLeagueClientEvent(
    buildEventUrl(
      '/lol-collections/v1/inventories/{digits}/backdrop',
      summonerId,
    ),
    (data) => {
      setBackgroundUrl(lolGameDataImg(data.backdropImage));
    },
  );

  if (!summonerData) return null;

  return (
    <Stack
      direction={'column'}
      height={'500px'}
      width={'100%'}
      alignItems={'center'}
      sx={{
        background: `linear-gradient(0deg, rgba(0,0,0,0.8) 50%, rgba(0,0,0,0) 100%), url(${backgroundUrl})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
    >
      <Stack
        direction={'column'}
        justifyContent={'center'}
        alignItems={'center'}
        rowGap={2}
        sx={{
          py: 3,
          px: 7,
        }}
      >
        <Avatar
          src={profileIcon(summonerData.info.profileIconId)}
          sx={{ width: iconSize, height: iconSize }}
        />
        <Typography>
          {summonerData.info.gameName} ({summonerData.info.summonerLevel})
        </Typography>
      </Stack>
    </Stack>
  );
};
