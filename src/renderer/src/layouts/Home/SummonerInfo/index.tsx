import { Box, ButtonBase, Stack, Typography } from '@mui/material';
import { useLeagueImage } from '@render/hooks/useLeagueImage';
import { useStore } from '@render/zustand/store';
import { CircularIcon } from '@render/components/CircularIcon';
import config from '@render/utils/config.util';
import { alpha } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useLeagueClientEvent } from '@render/hooks/useLeagueClientEvent';
import { useState } from 'react';
import { LolChatV1Friends } from '@shared/typings/lol/response/lolChatV1Friends';
import { getChatAvailabilityColor } from '@render/utils/chat.util';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';

export const SummonerInfo = () => {
  const navigate = useNavigate();
  const { profileIcon } = useLeagueImage();
  const { rcpFeLolSocial } = useLeagueTranslate();

  const currentSummoner = useStore().currentSummoner.info();
  const [chatData, setChatData] = useState<LolChatV1Friends>();

  const rcpFeLolSocialTrans = rcpFeLolSocial('trans');

  useLeagueClientEvent('/lol-chat/v1/me', (data) => {
    setChatData(data);
  });

  const getChatStats = () => {
    const chat = chatData;
    if (!chat) return;
    const gameStatus = chat.lol?.gameStatus;
    let stats: string = chat.availability;
    if (gameStatus && gameStatus !== 'outOfGame') {
      stats = gameStatus;
    }
    return rcpFeLolSocialTrans(`availability_${stats}`);
  };

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
        <Typography
          sx={{
            fontWeight: 'bold',
            fontSize: '0.7rem',
            color: getChatAvailabilityColor(chatData?.availability ?? ''),
          }}
        >
          {getChatStats()}
        </Typography>
      </Stack>
    </Stack>
  );
};
