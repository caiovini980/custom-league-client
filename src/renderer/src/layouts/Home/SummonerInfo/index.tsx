import {
  Avatar,
  Box,
  ButtonBase,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material';
import { useLeagueImage } from '@render/hooks/useLeagueImage';
import { useElectronHandle } from '@render/utils/electronFunction.util';
import { storeActions, useStore } from '@render/zustand/store';
import { useEffect } from 'react';

interface SummonerInfoProps {
  onClick: (summonerId: number) => void;
}

export const SummonerInfo = ({ onClick }: SummonerInfoProps) => {
  const { summoner } = useElectronHandle();
  const { profileIcon } = useLeagueImage();

  const { data: setCurrentSummoner } = storeActions.currentSummoner;
  const currentSummoner = useStore().currentSummoner.data();

  useEffect(() => {
    summoner.getCurrentSummoner().then((data) => {
      setCurrentSummoner(data);
    });
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
      onClick={() => onClick(currentSummoner.info.summonerId)}
    >
      <Avatar src={profileIcon(currentSummoner.info.profileIconId)} />
      <Stack
        direction={'column'}
        width={'100%'}
        justifyContent={'center'}
        px={1}
      >
        <Typography textAlign={'center'}>
          {currentSummoner.info.gameName} ({currentSummoner.info.summonerLevel})
        </Typography>
        <LinearProgress
          variant={'determinate'}
          value={currentSummoner.info.percentCompleteForNextLevel}
        />
      </Stack>
    </Stack>
  );
};
