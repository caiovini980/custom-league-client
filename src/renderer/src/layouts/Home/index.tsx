import { Box, Stack } from '@mui/material';
import { useAudio } from '@render/hooks/useAudioManager';
import { useLeagueClientEvent } from '@render/hooks/useLeagueClientEvent';
import { useLeagueClientRequest } from '@render/hooks/useLeagueClientRequest';
import { AppMenu } from '@render/layouts/Home/AppMenu';
import { ChampSelectFocus } from '@render/layouts/Home/ChampSelectFocus';
import { Chat } from '@render/layouts/Home/Chat';
import { FriendInvite } from '@render/layouts/Home/FriendInvite';
import { Invitations } from '@render/layouts/Home/Invitations';
import { ReadyCheck } from '@render/layouts/Home/ReadyCheck';
import { ViewActions } from '@render/layouts/Home/ViewActions';
import { currentSummonerStore } from '@render/zustand/stores/currentSummonerStore';
import { leagueClientStore } from '@render/zustand/stores/leagueClientStore';
import { lobbyStore } from '@render/zustand/stores/lobbyStore';
import { PropsWithChildren, useEffect, useState } from 'react';
import { SummonerInfo } from './SummonerInfo';
import { CentralizedStack } from '@render/components/CentralizedStack';
import { LoadingScreen } from '@render/components/LoadingScreen';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';

export const Home = ({ children }: PropsWithChildren) => {
  const { makeRequest } = useLeagueClientRequest();
  const { rcpFeLolSocial } = useLeagueTranslate();

  const sfxVignette = useAudio('sfx-vignette-celebration-intro');

  const { rcpFeLolSocialTrans } = rcpFeLolSocial;

  const [isStopping, setIsStopping] = useState(false);
  const [initialConfigurationComplete, setInitialConfigurationComplete] =
    useState(false);

  useLeagueClientEvent('/process-control/v1/process', (data) => {
    const stopping = data.status === 'Stopping';
    setIsStopping(stopping);
    leagueClientStore.isStopping.set(stopping);
  });

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

  useLeagueClientEvent('/lol-activity-center/v1/ready', (data) => {
    leagueClientStore.systemReady.activeCenter.set(data);
    setInitialConfigurationComplete(data);
    if (data) {
      loadSomeAreas();
    }
  });

  useLeagueClientEvent('/lol-store/v1/store-ready', (data) => {
    leagueClientStore.systemReady.store.set(data);
  });

  useLeagueClientEvent('/lol-loot/v1/ready', (data) => {
    leagueClientStore.systemReady.loot.set(data);
  });

  useLeagueClientEvent('/lol-yourshop/v1/ready', (data) => {
    leagueClientStore.systemReady.yourShop.set(data);
  });

  useLeagueClientEvent('/lol-objectives/v1/ready', (data) => {
    leagueClientStore.systemReady.objectives.set(data);
  });

  useLeagueClientEvent('/lol-chat/v1/session', (data) => {
    leagueClientStore.systemReady.chat.set(data.sessionState === 'loaded');
  });

  useLeagueClientEvent('/lol-ranked/v1/signed-ranked-stats', () => {
    leagueClientStore.systemReady.ranked.set(true);
  });

  useEffect(() => {
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

  const loadSomeAreas = () => {
    makeRequest('GET', '/lol-store/v1/status', undefined).then();
    makeRequest('GET', '/lol-yourshop/v1/status', undefined).then();
  };

  if (isStopping || !initialConfigurationComplete) {
    return (
      <CentralizedStack>
        <LoadingScreen
          loadingText={rcpFeLolSocialTrans(
            'roster_invite_disabled_checking_updates',
          )}
        />
      </CentralizedStack>
    );
  }

  return (
    <Stack
      overflow={'auto'}
      direction={'row'}
      height={'inherit'}
      width={'100%'}
    >
      <Stack
        id={'view-container'}
        position={'relative'}
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
        <ViewActions />
      </Stack>
    </Stack>
  );
};
