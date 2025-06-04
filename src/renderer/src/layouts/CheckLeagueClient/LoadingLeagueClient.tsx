import { Button, CircularProgress, Stack, Typography } from '@mui/material';
import { useElectronHandle } from '@render/utils/electronFunction.util';
import { useState } from 'react';
import { useStore } from '@render/zustand/store';
import { GetAppConfigResponse } from '@shared/typings/ipc-function/handle/app-config.typing';
import { CentralizedStack } from '@render/components/CentralizedStack';
import { CustomButton } from '@render/components/input';
import { useSnackNotification } from '@render/hooks/useSnackNotification';
import { useLocalTranslate } from '@render/hooks/useLocalTranslate';

export const LoadingLeagueClient = () => {
  const { localTranslate } = useLocalTranslate();
  const { snackError, snackSuccess } = useSnackNotification();
  const { client, appConfig } = useElectronHandle();
  const [waitLeague, setWaitLeague] = useState(false);
  const appConfigData = useStore().leagueClient.appConfig();

  const getConfig = (key: keyof GetAppConfigResponse) => {
    return appConfigData?.[key];
  };

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

  if (!getConfig('RIOT_CLIENT_PATH')) {
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
    </Stack>
  );
};
