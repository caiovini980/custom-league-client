import {
  Avatar,
  Box,
  ButtonBase,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material';
import { useLeagueImage } from '@render/hooks/useLeagueImage';
import { useStore } from '@render/zustand/store';

export const SummonerInfo = () => {
  const { profileIcon } = useLeagueImage();

  const currentSummoner = useStore().currentSummoner.info();

  if (!currentSummoner) return <Box height={60} />;

  return (
    <Stack
      direction={'row'}
      height={60}
      width={'100%'}
      alignItems={'center'}
      flexShrink={0}
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
