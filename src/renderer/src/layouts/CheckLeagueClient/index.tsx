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
import { useLocalTranslate } from '@render/hooks/useLocalTranslate';

export const CheckLeagueClient = ({ children }: PropsWithChildren) => {
  const { localTranslate } = useLocalTranslate();
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
  const isClientOpen = useStore().leagueClient.isClientOpen();

  const [loadingGameData, setLoadingGameData] = useState({
    percent: 0,
    file: '',
  });

  useLeagueClientEvent(
    '/riotclient/pre-shutdown/begin',
    () => {
      storeActions.leagueClient.isAvailable(false);
      storeActions.lobby.resetState();
      storeActions.currentSummoner.resetState();
    },
    {
      makeInitialRequest: false,
    },
  );

  const setClientStatus = (status: ClientStatusResponse) => {
    setIsConnected(status.connected);
    setVersion(status.info.version);
    setLocale(status.info.locale);
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
      client.changeShowClient(isClientOpen);
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
          loadingText={`${localTranslate('loading_game_data')} ${loadingGameData.percent}%`}
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
