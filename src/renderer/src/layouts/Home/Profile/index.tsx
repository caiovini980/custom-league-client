import {
  Avatar,
  Box,
  ButtonBase,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material';
import { useLeagueClientRequest } from '@render/hooks/useLeagueClientRequest';
import { useLeagueImage } from '@render/hooks/useLeagueImage';
import { storeActions, useStore } from '@render/zustand/store';
import { useEffect } from 'react';

export const Profile = () => {
  const { makeRequest } = useLeagueClientRequest();
  const { profileIcon } = useLeagueImage();

  const { data: setCurrentSummoner } = storeActions.currentSummoner;
  const currentSummoner = useStore().currentSummoner.data();

  useEffect(() => {
    //TODO: is better pass to main process?
    makeRequest('GET', '/lol-summoner/v1/current-summoner', undefined).then(
      (res) => {
        if (res.ok) {
          setCurrentSummoner(res.body);
        }
      },
    );
  }, []);

  if (!currentSummoner) return <Box height={60} />;

  return (
    <Stack
      direction={'row'}
      height={60}
      width={'100%'}
      alignItems={'center'}
      px={1}
      component={ButtonBase}
    >
      <Avatar src={profileIcon(currentSummoner.profileIconId)} />
      <Stack
        direction={'column'}
        width={'100%'}
        justifyContent={'center'}
        px={1}
      >
        <Typography textAlign={'center'}>
          {currentSummoner.gameName} ({currentSummoner.summonerLevel})
        </Typography>
        <LinearProgress
          variant={'determinate'}
          value={currentSummoner.percentCompleteForNextLevel}
        />
      </Stack>
    </Stack>
  );
};
