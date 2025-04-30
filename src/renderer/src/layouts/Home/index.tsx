import { Box, Divider, Stack } from '@mui/material';
import { useLeagueClientEvent } from '@render/hooks/useLeagueClientEvent';
import { BottomMenu } from '@render/layouts/Home/BottomMenu';
import { Chat } from '@render/layouts/Home/Chat';
import { storeActions } from '@render/zustand/store';
import { PropsWithChildren } from 'react';
import { SummonerInfo } from './SummonerInfo';

export const Home = ({ children }: PropsWithChildren) => {
  const { info: setCurrentSummoner } = storeActions.currentSummoner;

  useLeagueClientEvent('/lol-summoner/v1/current-summoner', (data) => {
    setCurrentSummoner(data);
  });

  return (
    <Stack
      overflow={'auto'}
      direction={'row'}
      height={'inherit'}
      width={'100%'}
    >
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
        height={'100%'}
        borderLeft={(t) => `1px solid ${t.palette.divider}`}
      >
        <SummonerInfo />
        <Divider />
        <Chat />
      </Stack>
    </Stack>
  );
};
