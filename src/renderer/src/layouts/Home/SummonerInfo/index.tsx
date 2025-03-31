import {
  Avatar,
  Box,
  ButtonBase,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material';
import { useLeagueClientEvent } from '@render/hooks/useLeagueClientEvent';
import { useLeagueImage } from '@render/hooks/useLeagueImage';
import { storeActions, useStore } from '@render/zustand/store';

interface SummonerInfoProps {
  onClick: (summonerId: number) => void;
}

export const SummonerInfo = ({ onClick }: SummonerInfoProps) => {
  const { profileIcon } = useLeagueImage();

  const { info: setCurrentSummoner } = storeActions.currentSummoner;
  const currentSummoner = useStore().currentSummoner.info();

  useLeagueClientEvent('/lol-summoner/v1/current-summoner', (data) => {
    setCurrentSummoner(data);
  });

  if (!currentSummoner) return <Box height={60} />;

  return (
    <Stack
      direction={'row'}
      height={60}
      width={'100%'}
      alignItems={'center'}
      px={1}
      component={ButtonBase}
      onClick={() => onClick(currentSummoner.summonerId)}
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
