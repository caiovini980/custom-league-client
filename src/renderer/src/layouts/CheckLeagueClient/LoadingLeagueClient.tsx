import { Button, CircularProgress, Stack, Typography } from '@mui/material';
import { useElectronHandle } from '@render/utils/electronFunction.util';
import { useState } from 'react';

export const LoadingLeagueClient = () => {
  const { client } = useElectronHandle();
  const [waitLeague, setWaitLeague] = useState(false);

  const onClickStartLeagueClient = () => {
    setWaitLeague(true);
    client
      .startLeagueClient()
      .then(() => {
        console.log('OK');
      })
      .finally(() => {
        setWaitLeague(false);
      });
  };

  return (
    <Stack
      direction={'column'}
      alignItems={'center'}
      justifyContent={'center'}
      height={'100%'}
      rowGap={2}
    >
      <Typography>Waiting for League Client...</Typography>
      <CircularProgress />

      <Button
        size={'small'}
        onClick={onClickStartLeagueClient}
        disabled={waitLeague}
        startIcon={waitLeague ? <CircularProgress /> : null}
      >
        {waitLeague ? 'Waiting for League Client' : 'Start League Client'}
      </Button>
    </Stack>
  );
};
