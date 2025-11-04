import { Box, Stack } from '@mui/material';
import { CentralizedStack } from '@render/components/CentralizedStack';
import { LoadingScreen } from '@render/components/LoadingScreen';
import { useAudio } from '@render/hooks/useAudioManager';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import { AppMenu } from '@render/layouts/Home/AppMenu';
import { Minigame } from '@render/layouts/Home/Minigame';
import { ChampSelectFocus } from '@render/layouts/Home/SideBar/ChampSelectFocus';
import { Chat } from '@render/layouts/Home/SideBar/Chat';
import { FriendRequest } from '@render/layouts/Home/SideBar/FriendRequest';
import { Invitations } from '@render/layouts/Home/SideBar/Invitations';
import { ReadyCheck } from '@render/layouts/Home/SideBar/ReadyCheck';
import { ViewActions } from '@render/layouts/Home/SideBar/ViewActions';
import { centerHubStore } from '@render/zustand/stores/centerHubStore';
import { chatStore } from '@render/zustand/stores/chatStore';
import { currentSummonerStore } from '@render/zustand/stores/currentSummonerStore';
import { leagueClientStore } from '@render/zustand/stores/leagueClientStore';
import { lobbyStore } from '@render/zustand/stores/lobbyStore';
import { minigameStore } from '@render/zustand/stores/minigameStore';
import { storeStore } from '@render/zustand/stores/storeStore';
import { PropsWithChildren, useEffect } from 'react';
import { SummonerInfo } from './SideBar/SummonerInfo';

export const Home = ({ children }: PropsWithChildren) => {
  const { rcpFeLolSocial } = useLeagueTranslate();
  const sfxVignette = useAudio('sfx-vignette-celebration-intro');

  const { rcpFeLolSocialTrans } = rcpFeLolSocial;

  const isStopping = leagueClientStore.isStopping.use();
  const initialConfigurationComplete =
    leagueClientStore.systemReady.platformConfig.use();

  useEffect(() => {
    if (!isStopping) return;
    leagueClientStore.resetState();
    lobbyStore.resetState();
    chatStore.resetState();
    storeStore.resetState();
    currentSummonerStore.resetState();
    minigameStore.resetState();
    centerHubStore.resetState();
  }, [isStopping]);

  useEffect(() => {
    const unsubscribe = leagueClientStore.isAvailable.onChange(
      (isAvailable) => {
        if (isAvailable) {
          sfxVignette.play();
        }
      },
    );

    return () => {
      unsubscribe();
    };
  }, []);

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
        <Box
          display={'flex'}
          height={'100%'}
          width={'100%'}
          overflow={'auto'}
          position={'relative'}
        >
          {children}
          <Minigame />
        </Box>
      </Stack>
      <Stack
        direction={'column'}
        height={'100%'}
        width={250}
        flexShrink={0}
        borderLeft={'1px solid var(--mui-palette-divider)'}
      >
        <SummonerInfo />
        <Invitations />
        <ReadyCheck />
        <FriendRequest />
        <Chat />
        <ChampSelectFocus />
        <ViewActions />
      </Stack>
    </Stack>
  );
};
