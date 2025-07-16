import { Button, CircularProgress, Stack, Typography } from '@mui/material';
import { CentralizedStack } from '@render/components/CentralizedStack';
import { CustomButton } from '@render/components/input';
import { useLocalTranslate } from '@render/hooks/useLocalTranslate';
import { useSnackNotification } from '@render/hooks/useSnackNotification';
import {
  electronHandle,
  useElectronListen,
} from '@render/utils/electronFunction.util';
import { appConfigStore } from '@render/zustand/stores/appConfigStore';
import { useState } from 'react';

export const LoadingLeagueClient = () => {
  const { localTranslate } = useLocalTranslate();
  const { snackError, snackSuccess } = useSnackNotification();
  const { client, appConfig } = electronHandle;

  const riotClientPath = appConfigStore.RIOT_CLIENT_PATH.use();

  const [waitLeague, setWaitLeague] = useState(false);
  const [processStatus, setProcessStatus] = useState<'exited' | 'initialized'>(
    'exited',
  );

  useElectronListen('processStatus', (status) => {
    setProcessStatus(status);
  });

  const onClickStartLeagueClient = () => {
    client.startLeagueClient().finally(() => {
      setWaitLeague(false);
    });
  };

  const changePath = () => {
    appConfig
      .setConfig({
        name: 'RIOT_CLIENT_PATH',
        value: null,
      })
      .then(() => {
        snackSuccess(localTranslate('riot_client_path_configured'));
      })
      .catch((err) => {
        if ('description' in err) {
          snackError(err.description);
        }
      });
  };

  if (!riotClientPath) {
    return (
      <CentralizedStack>
        <Typography>
          {localTranslate('need_configure_riot_client_path')}
        </Typography>
        <CustomButton variant={'contained'} onClick={changePath}>
          {localTranslate('configure_riot_client_path_button')}
        </CustomButton>
        <Typography
          color={'textSecondary'}
          variant={'subtitle2'}
          fontSize={'0.75rem'}
        >
          {localTranslate('eg')} D:\Riot Games\Riot Client
        </Typography>
      </CentralizedStack>
    );
  }

  return (
    <Stack
      direction={'column'}
      alignItems={'center'}
      justifyContent={'center'}
      height={'100%'}
      rowGap={2}
    >
      <Typography>{localTranslate('waiting_for_league_client')}</Typography>
      <CircularProgress />
      {processStatus === 'exited' && (
        <Button
          size={'small'}
          onClick={onClickStartLeagueClient}
          disabled={waitLeague}
          startIcon={waitLeague ? <CircularProgress /> : null}
        >
          {waitLeague
            ? localTranslate('waiting_for_league_client')
            : localTranslate('start_league_client_button')}
        </Button>
      )}
    </Stack>
  );
};
