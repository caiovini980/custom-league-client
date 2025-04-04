import { Button, Stack, Typography } from '@mui/material';
import { LoadingScreen } from '@render/components/LoadingScreen';
import { useLeagueClientEvent } from '@render/hooks/useLeagueClientEvent';
import { useElectronHandle } from '@render/utils/electronFunction.util';
import { storeActions, useStore } from '@render/zustand/store';

export const Lobby = () => {
  const { lobby } = useElectronHandle();

  const isAvailable = useStore().leagueClient.isAvailable();
  const { isAvailable: setIsAvailable } = storeActions.leagueClient;

  useLeagueClientEvent('/lol-gameflow/v1/availability', (data) => {
    setIsAvailable(data.isAvailable);
  });

  function onFindAramButtonClicked() {
    console.log('Finding ARAM...');
    lobby.createAram();
  }

  function onFindNormalGameButtonClicked() {
    console.log('Finding Normal Game...');
  }

  if (!isAvailable) {
    return <LoadingScreen height={'100%'} />;
  }

  return (
    <Stack
      direction={'column'}
      justifyContent={'center'}
      alignItems={'center'}
      height={'100%'}
      rowGap={2}
    >
      <Typography>Welcome to League Client Helper</Typography>
      <Button variant="contained" onClick={onFindAramButtonClicked}>
        Find ARAM
      </Button>
      <Button variant="contained" onClick={onFindNormalGameButtonClicked}>
        Find Normal Game
      </Button>
    </Stack>
  );
};
