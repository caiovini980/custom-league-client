import { Box, Stack } from '@mui/material';
import { useLeagueClientEvent } from '@render/hooks/useLeagueClientEvent';
import { AppMenu } from '@render/layouts/Home/AppMenu';
import { Chat } from '@render/layouts/Home/Chat';
import { storeActions } from '@render/zustand/store';
import { PropsWithChildren } from 'react';
import { SummonerInfo } from './SummonerInfo';
import { ReadyCheck } from '@render/layouts/Home/ReadyCheck';
import { Invitations } from '@render/layouts/Home/Invitations';
import { ChampSelectFocus } from '@render/layouts/Home/ChampSelectFocus';

export const Home = ({ children }: PropsWithChildren) => {
  useLeagueClientEvent('/lol-summoner/v1/current-summoner', (data) => {
    storeActions.currentSummoner.info(data);
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

  useLeagueClientEvent('/lol-gameflow/v1/gameflow-phase', (data) => {
    if (['None', 'GameStart', 'InProgress'].includes(data)) {
      storeActions.lobby.resetState();
    }
    if (['ChampSelect', 'Lobby'].includes(data)) {
      setTimeout(() => {
        storeActions.lobby.matchMaking(null);
      }, 1000);
    }
  });

  useLeagueClientEvent('/lol-champ-select/v1/session', (data) => {
    storeActions.lobby.champSelect(data);
  });

  return (
    <Stack
      overflow={'auto'}
      direction={'row'}
      height={'inherit'}
      width={'100%'}
    >
      <Stack
        direction={'column'}
        overflow={'auto'}
        height={'100%'}
        width={'100%'}
      >
        <AppMenu />
        <Box display={'flex'} height={'100%'} width={'100%'} overflow={'auto'}>
          {children}
        </Box>
      </Stack>
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
      <ChampSelectFocus />
    </Stack>
  );
};
