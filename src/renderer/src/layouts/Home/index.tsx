import { Container, Stack, Typography } from '@mui/material';
import AlertBox from '@render/components/AlertBox';
import { useSnackNotification } from '@render/hooks/useSnackNotification';
import {
  electronListen,
  useElectronHandle,
} from '@render/utils/electronFunction.util';
import { JSX, useEffect } from 'react';

export const Home = (): JSX.Element => {
  const { snackSuccess } = useSnackNotification();
  const { server } = useElectronHandle();

  useEffect(() => {
    const { unsubscribe } = electronListen.serverUp((data) => {
      snackSuccess(data ? 'Server NestJS is ok!' : 'Error NestJS');
    });

    server.sendInfo('ok');

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <Container sx={{ height: '100%' }}>
      <Stack
        direction={'column'}
        justifyContent={'center'}
        alignItems={'center'}
        height={'inherit'}
        rowGap={2}
      >
        <Typography>Welcome to Electron</Typography>
        <AlertBox type={'info'} message={'Server info'} />
      </Stack>
    </Container>
  );
};
