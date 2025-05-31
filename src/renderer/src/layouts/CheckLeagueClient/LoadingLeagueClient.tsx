import { Button, CircularProgress, Stack, Typography } from '@mui/material';
import { useElectronHandle } from '@render/utils/electronFunction.util';
import { useState } from 'react';
import { useStore } from '@render/zustand/store';
import { GetAppConfigResponse } from '@shared/typings/ipc-function/handle/app-config.typing';
import { CentralizedStack } from '@render/components/CentralizedStack';
import { CustomButton } from '@render/components/input';

export const LoadingLeagueClient = () => {
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

  if (!getConfig('RIOT_CLIENT_PATH')) {
    return (
      <CentralizedStack>
        <Typography>You need configure "Riot Client Path"</Typography>
        <CustomButton
          variant={'contained'}
          onClick={() =>
            appConfig.setConfig({
              name: 'RIOT_CLIENT_PATH',
              value: null,
            })
          }
        >
          Configure Riot Client Path
        </CustomButton>
        <Typography
          color={'textSecondary'}
          variant={'subtitle2'}
          fontSize={'0.75rem'}
        >
          Eg.: D:\Riot Games\Riot Client
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
