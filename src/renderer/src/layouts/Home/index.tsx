import { Box, Stack } from '@mui/material';
import { CentralizedStack } from '@render/components/CentralizedStack';
import { LoadingScreen } from '@render/components/LoadingScreen';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import { AppMenu } from '@render/layouts/Home/AppMenu';
import { ChampSelectFocus } from '@render/layouts/Home/ChampSelectFocus';
import { Chat } from '@render/layouts/Home/Chat';
import { FriendInvite } from '@render/layouts/Home/FriendInvite';
import { Invitations } from '@render/layouts/Home/Invitations';
import { Minigame } from '@render/layouts/Home/Minigame';
import { ReadyCheck } from '@render/layouts/Home/ReadyCheck';
import { ViewActions } from '@render/layouts/Home/ViewActions';
import { leagueClientStore } from '@render/zustand/stores/leagueClientStore';
import { PropsWithChildren } from 'react';
import { SummonerInfo } from './SummonerInfo';

export const Home = ({ children }: PropsWithChildren) => {
  const { rcpFeLolSocial } = useLeagueTranslate();

  const { rcpFeLolSocialTrans } = rcpFeLolSocial;

  const isStopping = leagueClientStore.isStopping.use();
  const initialConfigurationComplete =
    leagueClientStore.systemReady.platformConfig.use();

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
