import { Box, ButtonBase, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { CircularIcon } from '@render/components/CircularIcon';
import { CustomIconButton } from '@render/components/input';
import { useLeagueClientEvent } from '@render/hooks/useLeagueClientEvent';
import { useLeagueImage } from '@render/hooks/useLeagueImage';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import { EditChatStatus } from '@render/layouts/Home/SideBar/SummonerInfo/EditChatStatus';
import { SummonerInfoListener } from '@render/layouts/Home/SideBar/SummonerInfo/SummonerInfoListener';
import { getChatAvailabilityColor } from '@render/utils/chat.util';
import config from '@render/utils/config.util';
import { currentSummonerStore } from '@render/zustand/stores/currentSummonerStore';
import { LolChatV1Friends } from '@shared/typings/lol/response/lolChatV1Friends';
import { MouseEvent, useState } from 'react';
import { useNavigate } from 'react-router';

export const SummonerInfo = () => {
  const navigate = useNavigate();
  const { profileIcon } = useLeagueImage();
  const { rcpFeLolSocial } = useLeagueTranslate();

  const currentSummoner = currentSummonerStore.info.use();
  const [chatData, setChatData] = useState<LolChatV1Friends>();
  const [openModal, setOpenModal] = useState(false);

  const { rcpFeLolSocialTrans } = rcpFeLolSocial;

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

  const onClickEditStatus = (ev: MouseEvent) => {
    ev.stopPropagation();
    setOpenModal(true);
  };

  if (!currentSummoner) {
    return <Box height={config.topBarHeight} />;
  }

  return (
    <>
      <Stack
        direction={'row'}
        height={config.topBarHeight}
        width={'100%'}
        alignItems={'center'}
        flexShrink={0}
        px={1}
        sx={{
          borderBottom: '1px solid var(--mui-palette-divider)',
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
        <CustomIconButton
          onClick={onClick}
          sx={{ position: 'relative', p: 0.5 }}
        >
          <CircularIcon src={profileIcon(currentSummoner.profileIconId)} />
          <Typography
            sx={{
              position: 'absolute',
              top: 2,
              right: -10,
              backgroundColor: '#04162170',
              borderRadius: 2,
              width: 30,
              color: 'var(--mui-palette-common-white)',
            }}
            fontSize={'0.6rem'}
          >
            {currentSummoner.summonerLevel}
          </Typography>
        </CustomIconButton>
        <Stack
          direction={'column'}
          width={'100%'}
          justifyContent={'center'}
          px={1}
        >
          <Typography textAlign={'center'}>
            {currentSummoner.gameName}
          </Typography>
          <Typography
            component={ButtonBase}
            onClick={onClickEditStatus}
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
      <SummonerInfoListener summonerId={currentSummoner.summonerId} />
      {chatData && (
        <EditChatStatus
          chatData={chatData}
          open={openModal}
          handleClose={() => setOpenModal(false)}
        />
      )}
    </>
  );
};
