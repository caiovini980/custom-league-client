import {
  Box,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import { useLeagueClientEvent } from '@render/hooks/useLeagueClientEvent';
import { BottomMenu } from '@render/layouts/Home/BottomMenu';
import {
  ProfileModal,
  ProfileModalRef,
} from '@render/layouts/Profile/ProfileModal';
import { storeActions, useStore } from '@render/zustand/store';
import { PropsWithChildren, useEffect, useRef, useState } from 'react';
import { SummonerInfo } from './SummonerInfo';

export const Home = ({ children }: PropsWithChildren) => {
  const profileModal = useRef<ProfileModalRef>(null);

  const version = useStore().leagueClient.version();
  const language = useStore().leagueClient.language();
  const {
    version: setVersion,
    language: setLanguage,
    isAvailable: setIsAvailable,
  } = storeActions.leagueClient;

  const [loadingGameData, setLoadingGameData] = useState(true);

  useLeagueClientEvent('/lol-gameflow/v1/availability', (data) => {
    setIsAvailable(data.isAvailable);
  });

  useLeagueClientEvent('/riotclient/region-locale', (data) => {
    setLanguage(data.locale);
  });

  useLeagueClientEvent('/system/v1/builds', (data) => {
    setVersion(data.version.substring(0, 4));
  });

  const { info: setCurrentSummoner } = storeActions.currentSummoner;

  useLeagueClientEvent('/lol-summoner/v1/current-summoner', (data) => {
    setCurrentSummoner(data);
  });

  useEffect(() => {
    setLoadingGameData(!(!!version && !!language));
  }, [version, language]);

  if (loadingGameData) {
    return (
      <Stack
        direction={'column'}
        height={'100%'}
        width={'100%'}
        justifyContent={'center'}
        alignItems={'center'}
      >
        <Typography>Loading...</Typography>
        <CircularProgress />
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
          <SummonerInfo
            onClick={(summonerId) => profileModal.current?.open(summonerId)}
          />
          <Divider />
          chat
        </Stack>
      </Stack>
      <ProfileModal ref={profileModal} />
    </Box>
  );
};
