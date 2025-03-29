import { Button, Stack, Typography } from '@mui/material';
import { useElectronHandle } from '@render/utils/electronFunction.util';

export const Lobby = () => {
  const { lobby } = useElectronHandle();

  function OnFindAramButtonClicked() {
    console.log('Finding ARAM...');
    lobby.createAram();
  }

  function OnFindNormalGameButtonClicked() {
    console.log('Finding Normal Game...');
  }

  return (
    <Stack
      direction={'column'}
      justifyContent={'center'}
      alignItems={'center'}
      height={'inherit'}
      rowGap={2}
    >
      <Typography>Welcome to League Client Helper</Typography>
      <Button variant="contained" onClick={OnFindAramButtonClicked}>
        Find ARAM
      </Button>
      <Button variant="contained" onClick={OnFindNormalGameButtonClicked}>
        Find Normal Game
      </Button>
    </Stack>
  );
};
