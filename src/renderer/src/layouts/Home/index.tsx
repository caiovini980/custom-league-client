import { Box, Divider, LinearProgress, Stack, Typography } from '@mui/material';
import { LoadingScreen } from '@render/components/LoadingScreen';
import { useLeagueClientEvent } from '@render/hooks/useLeagueClientEvent';
import { BottomMenu } from '@render/layouts/Home/BottomMenu';
import { Chat } from '@render/layouts/Home/Chat';
import { useElectronListen } from '@render/utils/electronFunction.util';
import { storeActions } from '@render/zustand/store';
import { PropsWithChildren, useState } from 'react';
import { SummonerInfo } from './SummonerInfo';

export const Home = ({ children }: PropsWithChildren) => {
  const { info: setCurrentSummoner } = storeActions.currentSummoner;
  const { setGameData } = storeActions.gameData;

  const [loadingGameData, setLoadingGameData] = useState({
    status: false,
    percent: 0,
    file: '',
  });

  useLeagueClientEvent('/lol-summoner/v1/current-summoner', (data) => {
    setCurrentSummoner(data);
  });

  useElectronListen('onLoadGameData', (data) => {
    if (data.status === 'downloading') {
      setLoadingGameData({
        status: true,
        file: data.info.currentFileDownloading,
        percent: data.info.currentPercent,
      });
    }
    if (data.status === 'complete') {
      setGameData(data.info);
      setLoadingGameData({
        status: false,
        percent: 100,
        file: '',
      });
    }
  });

  if (loadingGameData.status) {
    return (
      <Stack
        direction={'column'}
        height={'100%'}
        rowGap={2}
        justifyContent={'center'}
        alignItems={'center'}
      >
        <LoadingScreen
          loadingText={`Loading game data ${loadingGameData.percent}%`}
        />
        <LinearProgress
          sx={{ width: '60%' }}
          variant={'determinate'}
          value={loadingGameData.percent}
        />
        <Typography
          overflow={'hidden'}
          whiteSpace={'nowrap'}
          textOverflow={'ellipsis'}
          width={'60%'}
        >
          {loadingGameData.file}
        </Typography>
      </Stack>
    );
  }

  return (
    <Box overflow={'auto'} height={'100%'} width={'100%'}>
      <Stack direction={'row'} height={'inherit'} width={'100%'}>
        <Box
          overflow={'auto'}
          height={'100%'}
          width={'100%'}
          position={'relative'}
        >
          {children}
          <Box
            position={'absolute'}
            bottom={12}
            right={0}
            left={0}
            display={'flex'}
            justifyContent={'center'}
          >
            <BottomMenu />
          </Box>
        </Box>
        <Stack
          direction={'column'}
          overflow={'auto'}
          height={'100%'}
          width={250}
          borderLeft={(t) => `1px solid ${t.palette.divider}`}
        >
          <SummonerInfo />
          <Divider />
          <Chat />
        </Stack>
      </Stack>
    </Box>
  );
};
