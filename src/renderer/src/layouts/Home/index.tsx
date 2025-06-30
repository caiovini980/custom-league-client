import { Box, Stack } from '@mui/material';
import { useLeagueClientEvent } from '@render/hooks/useLeagueClientEvent';
import { AppMenu } from '@render/layouts/Home/AppMenu';
import { Chat } from '@render/layouts/Home/Chat';
import { PropsWithChildren, useEffect } from 'react';
import { SummonerInfo } from './SummonerInfo';
import { ReadyCheck } from '@render/layouts/Home/ReadyCheck';
import { Invitations } from '@render/layouts/Home/Invitations';
import { ChampSelectFocus } from '@render/layouts/Home/ChampSelectFocus';
import { FriendInvite } from '@render/layouts/Home/FriendInvite';
import { currentSummonerStore } from '@render/zustand/stores/currentSummonerStore';
import { lobbyStore } from '@render/zustand/stores/lobbyStore';
import { leagueClientStore } from '@render/zustand/stores/leagueClientStore';
import { useAudio } from '@render/hooks/useAudioManager';
import { useLeagueClientRequest } from '@render/hooks/useLeagueClientRequest';

export const Home = ({ children }: PropsWithChildren) => {
  const { makeRequest } = useLeagueClientRequest();
  const sfxVignette = useAudio('sfx-vignette-celebration-intro');
  useAudio('background_music', true);

  useLeagueClientEvent('/lol-summoner/v1/current-summoner', (data) => {
    currentSummonerStore.info.set(data);
  });

  useLeagueClientEvent('/lol-lobby/v2/lobby', (data) => {
    lobbyStore.lobby.set(data);
  });

  useLeagueClientEvent('/lol-gameflow/v1/availability', (data) => {
    leagueClientStore.isAvailable.set(data.isAvailable);
  });

  useLeagueClientEvent('/lol-gameflow/v1/session', (data) => {
    lobbyStore.gameFlow.set(data);
  });

  useLeagueClientEvent('/lol-gameflow/v1/gameflow-phase', (data) => {
    if (['None', 'GameStart', 'InProgress'].includes(data)) {
      lobbyStore.resetState();
    }
    if (data !== 'ChampSelect') {
      lobbyStore.champSelect.set(null);
    }
    if (['ChampSelect', 'Lobby'].includes(data)) {
      setTimeout(() => {
        lobbyStore.matchMaking.set(null);
      }, 500);
    }
  });

  useLeagueClientEvent(
    '/lol-lobby-team-builder/champ-select/v1/session',
    (data) => {
      lobbyStore.champSelect.set(data);
    },
  );

  useEffect(() => {
    // Needed to start store
    makeRequest('GET', '/lol-store/v1/status', undefined).then();

    const unsubscribe = leagueClientStore.isAvailable.onChange(
      (isAvailable) => {
        if (isAvailable) {
          sfxVignette.play(false);
        }
      },
    );

    return () => {
      unsubscribe();
    };
  }, []);

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
        borderLeft={'1px solid var(--mui-palette-divider)'}
      >
        <SummonerInfo />
        <ReadyCheck />
        <FriendInvite />
        <Chat />
        <ChampSelectFocus />
      </Stack>
    </Stack>
  );
};
