import { Button, Container, Stack, Typography } from '@mui/material';
import AlertBox from '@render/components/AlertBox';
import { ElectronFunction } from '@render/env';
import { useSnackNotification } from '@render/hooks/useSnackNotification';
import {
  electronListen,
  useElectronHandle,
} from '@render/utils/electronFunction.util';
import { JSX, useEffect } from 'react';

export const Home = (): JSX.Element => {
  const { snackSuccess } = useSnackNotification();
  const { server, lobby } = useElectronHandle();

  useEffect(() => {
    const { unsubscribe } = electronListen.serverUp((isServerUp) => {
      snackSuccess(isServerUp ? 'Server NestJS is ok!' : 'Error NestJS');
    });

    electronListen.isClientConnected((isConnected) => {
      snackSuccess(isConnected ? 'CONNECTED to Client' : 'DISCONNECTED from Client');
    });

    server.sendInfo('ok').then((data) => {
      console.log(data)
    });

    return () => {
      unsubscribe();
    };
  }, []);

  function OnFindAramButtonClicked() {
    console.log("Finding ARAM...")
    lobby.createAram()
  }
  
  function OnFindNormalGameButtonClicked() {
    console.log("Finding Normal Game...")
  }

  return (
    <Container sx={{ height: '100%' }}>
      <Stack
        direction={'column'}
        justifyContent={'center'}
        alignItems={'center'}
        height={'inherit'}
        rowGap={2}
      >
        <Typography>Welcome to League Client Helper</Typography>
        <Button variant='contained' onClick={OnFindAramButtonClicked}>Find ARAM</Button>
        <Button variant='contained' onClick={OnFindNormalGameButtonClicked}>Find Normal Game</Button>
        <AlertBox type={'info'} message={'Server info'} />
      </Stack>
    </Container>
  );
};
