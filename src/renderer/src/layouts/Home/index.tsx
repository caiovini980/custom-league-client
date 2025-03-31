import {
  Box,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import { useLeagueClientEvent } from '@render/hooks/useLeagueClientEvent';
import {
  ProfileModal,
  ProfileModalRef,
} from '@render/layouts/Home/Profile/ProfileModal';
import { SummonerInfo } from '@render/layouts/Home/SummonerInfo';
import { storeActions, useStore } from '@render/zustand/store';
import { PropsWithChildren, useEffect, useRef, useState } from 'react';

export const Home = ({ children }: PropsWithChildren) => {
  const profileModal = useRef<ProfileModalRef>(null);

  const isAvailable = useStore().leagueClient.isAvailable();
  const version = useStore().leagueClient.version();
  const language = useStore().leagueClient.language();
  const { version: setVersion, language: setLanguage } =
    storeActions.leagueClient;

  const [loadingGameData, setLoadingGameData] = useState(true);

  useLeagueClientEvent('/riotclient/region-locale', (data) => {
    setLanguage(data.locale);
  });

  useLeagueClientEvent('/system/v1/builds', (data) => {
    setVersion(data.version.substring(0, 4));
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
      <Stack direction={'row'} height={'inherit'}>
        <Box overflow={'auto'} height={'100%'} width={'100%'}>
          {isAvailable ? (
            children
          ) : (
            <Stack
              direction={'column'}
              rowGap={2}
              justifyContent={'center'}
              alignItems={'center'}
              height={'100%'}
              width={'100%'}
            >
              <Typography>Loading...</Typography>
              <CircularProgress />
            </Stack>
          )}
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
