import { Box, ButtonBase, Stack, Typography } from '@mui/material';
import { useLeagueImage } from '@render/hooks/useLeagueImage';
import { useStore } from '@render/zustand/store';
import { CircularIcon } from '@render/components/CircularIcon';
import config from '@render/utils/config.util';
import { alpha } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

export const SummonerInfo = () => {
  const navigate = useNavigate();
  const { profileIcon } = useLeagueImage();

  const currentSummoner = useStore().currentSummoner.info();

  const onClick = () => {
    navigate('/profile');
  };

  if (!currentSummoner) {
    return <Box height={config.topBarHeight} />;
  }

  return (
    <Stack
      direction={'row'}
      height={config.topBarHeight}
      width={'100%'}
      alignItems={'center'}
      flexShrink={0}
      px={1}
      component={ButtonBase}
      onClick={onClick}
      sx={{
        borderBottom: (t) => `1px solid ${t.palette.divider}`,
        position: 'relative',
        zIndex: 1,
        '&:after': {
          content: "''",
          backgroundColor: (t) => alpha(t.palette.primary.main, 0.3),
          position: 'absolute',
          height: '100%',
          width: `${currentSummoner.percentCompleteForNextLevel}%`,
          left: 0,
          zIndex: -1,
        },
      }}
    >
      <CircularIcon src={profileIcon(currentSummoner.profileIconId)} />
      <Stack
        direction={'column'}
        width={'100%'}
        justifyContent={'center'}
        px={1}
      >
        <Typography textAlign={'center'}>
          {currentSummoner.gameName} ({currentSummoner.summonerLevel})
        </Typography>
      </Stack>
    </Stack>
  );
};
