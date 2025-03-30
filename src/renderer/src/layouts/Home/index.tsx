import {
  Box,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import { Profile } from '@render/layouts/Home/Profile';
import { useElectronHandle } from '@render/utils/electronFunction.util';
import { storeActions, useStore } from '@render/zustand/store';
import { PropsWithChildren, useEffect } from 'react';

export const Home = ({ children }: PropsWithChildren) => {
  const { client } = useElectronHandle();

  const isAvailable = useStore().leagueClient.isAvailable();
  const { version: setVersion } = storeActions.leagueClient;

  useEffect(() => {
    client.getVersion().then((version) => {
      setVersion(version);
    });
  }, []);

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
          <Profile />
          <Divider />
          chat
        </Stack>
      </Stack>
    </Box>
  );
};
