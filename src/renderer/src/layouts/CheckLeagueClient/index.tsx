import { LinearProgress, Stack, Typography } from '@mui/material';
import { LoadingScreen } from '@render/components/LoadingScreen';
import { useLeagueClientEvent } from '@render/hooks/useLeagueClientEvent';
import { LoadingLeagueClient } from '@render/layouts/CheckLeagueClient/LoadingLeagueClient';
import {
  useElectronHandle,
  useElectronListen,
} from '@render/utils/electronFunction.util';
import { storeActions, useStore } from '@render/zustand/store';
import { ClientStatusResponse } from '@shared/typings/ipc-function/to-renderer/client-status.typing';
import { PropsWithChildren, useEffect, useState } from 'react';

export const CheckLeagueClient = ({ children }: PropsWithChildren) => {
  const { client } = useElectronHandle();
  const {
    isConnected: setIsConnected,
    version: setVersion,
    locale: setLocale,
    isAvailable: setIsAvailable,
  } = storeActions.leagueClient;
  const gameDataLoaded = useStore().gameData.loaded();
  const { setGameData, loaded: setGameDataLoaded } = storeActions.gameData;
  const isConnected = useStore().leagueClient.isConnected();

  const [loadingGameData, setLoadingGameData] = useState({
    percent: 0,
    file: '',
  });

  useLeagueClientEvent(
    '/riotclient/pre-shutdown/begin',
    () => {
      storeActions.leagueClient.resetState();
      storeActions.lobby.resetState();
      storeActions.currentSummoner.resetState();
    },
    {
      makeInitialRequest: false,
    },
  );

  const setClientStatus = (status: ClientStatusResponse) => {
    setIsConnected(status.connected);
    if (status.connected) {
      setVersion(status.info.version);
      setLocale(status.info.locale);
    }
  };

  useElectronListen('clientStatus', (data) => {
    setClientStatus(data);
  });

  useEffect(() => {
    client.getClientStatus().then(setClientStatus);
  }, []);

  useEffect(() => {
    if (!isConnected) {
      setIsAvailable(false);
    }
  }, [isConnected]);

  useEffect(() => {
    if (!gameDataLoaded && isConnected) {
      client.reloadGameData();
    }
  }, [gameDataLoaded, isConnected]);

  useElectronListen('onLoadGameData', (data) => {
    if (data.status === 'downloading') {
      setGameDataLoaded(false);
      setLoadingGameData({
        file: data.info.currentFileDownloading,
        percent: data.info.currentPercent,
      });
    }
    if (data.status === 'complete') {
      setGameData({
        loaded: true,
        ...data.info,
      });
      setLoadingGameData({
        percent: 100,
        file: '',
      });
    }
  });

  if (!isConnected) {
    return <LoadingLeagueClient />;
  }

  if (!gameDataLoaded) {
    return (
      <Stack
        direction={'column'}
        height={'100%'}
        rowGap={2}
        justifyContent={'center'}
        alignItems={'center'}
      >
        <LoadingScreen
          loadingText={`Loading game data ${loadingGameData.percent}%`}
        />
        <LinearProgress
          sx={{ width: '60%' }}
          variant={'determinate'}
          value={loadingGameData.percent}
        />
        <Typography
          overflow={'hidden'}
          whiteSpace={'nowrap'}
          textOverflow={'ellipsis'}
          width={'60%'}
        >
          {loadingGameData.file}
        </Typography>
      </Stack>
    );
  }

  return <>{children}</>;
};
