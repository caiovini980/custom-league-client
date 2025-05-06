import { Box, Stack } from '@mui/material';
import { useLeagueClientEvent } from '@render/hooks/useLeagueClientEvent';
import { BottomMenu } from '@render/layouts/Home/BottomMenu';
import { Chat } from '@render/layouts/Home/Chat';
import { storeActions } from '@render/zustand/store';
import { PropsWithChildren } from 'react';
import { SummonerInfo } from './SummonerInfo';
import { ReadyCheck } from '@render/layouts/Home/ReadyCheck';
import { Invitations } from '@render/layouts/Home/Invitations';

export const Home = ({ children }: PropsWithChildren) => {
  const { info: setCurrentSummoner } = storeActions.currentSummoner;

  useLeagueClientEvent('/lol-summoner/v1/current-summoner', (data) => {
    setCurrentSummoner(data);
  });

  useLeagueClientEvent('/lol-lobby/v2/lobby', (data) => {
    storeActions.lobby.lobby(data);
  });

  useLeagueClientEvent('/lol-gameflow/v1/availability', (data) => {
    storeActions.leagueClient.isAvailable(data.isAvailable);
  });

  useLeagueClientEvent('/lol-gameflow/v1/session', (data) => {
    storeActions.lobby.gameFlow(data);
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
      <Invitations />
      <Stack
        direction={'column'}
        height={'100%'}
        width={250}
        flexShrink={0}
        borderLeft={(t) => `1px solid ${t.palette.divider}`}
      >
        <SummonerInfo />
        <ReadyCheck />
        <Chat />
      </Stack>
    </Stack>
  );
};
