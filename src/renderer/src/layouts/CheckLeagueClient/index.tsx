import {
  LinearProgress,
  Stack,
  Typography,
  useColorScheme,
} from '@mui/material';
import { CentralizedStack } from '@render/components/CentralizedStack';
import { CustomButton } from '@render/components/input';
import { LoadingScreen } from '@render/components/LoadingScreen';
import { useLocalTranslate } from '@render/hooks/useLocalTranslate';
import { LeagueClientImperativeModal } from '@render/layouts/CheckLeagueClient/LeagueClientImperativeModal';
import { LeagueClientObserverEvent } from '@render/layouts/CheckLeagueClient/LeagueClientObserverEvent';
import { LoadingLeagueClient } from '@render/layouts/CheckLeagueClient/LoadingLeagueClient';
import {
  useElectronHandle,
  useElectronListen,
} from '@render/utils/electronFunction.util';
import { appConfigStore } from '@render/zustand/stores/appConfigStore';
import { currentSummonerStore } from '@render/zustand/stores/currentSummonerStore';
import { gameDataStore } from '@render/zustand/stores/gameDataStore';
import { leagueClientStore } from '@render/zustand/stores/leagueClientStore';
import { lobbyStore } from '@render/zustand/stores/lobbyStore';
import { ClientStatusResponse } from '@shared/typings/ipc-function/to-renderer/client-status.typing';
import { PropsWithChildren, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

export const CheckLeagueClient = ({ children }: PropsWithChildren) => {
  const navigate = useNavigate();
  const { localTranslate } = useLocalTranslate();
  const { client, appConfig } = useElectronHandle();
  const { setMode } = useColorScheme();

  const themeMode = appConfigStore.THEME_MODE.use();
  const gameDataLoaded = gameDataStore.loaded.use();
  const isConnected = leagueClientStore.isConnected.use();
  const isClientOpen = leagueClientStore.isClientOpen.use();

  const [loadingGameData, setLoadingGameData] = useState({
    percent: 0,
    file: '',
  });

  const [isGameDataError, setIsGameDataError] = useState(false);

  const setClientStatus = (status: ClientStatusResponse) => {
    leagueClientStore.isConnected.set(status.connected);
    leagueClientStore.version.set(status.info.version);
    leagueClientStore.locale.set(status.info.locale);
    leagueClientStore.language.set(status.info.language);
  };

  const onClickTryAgain = () => {
    setIsGameDataError(false);
    client.reloadGameData();
  };

  useElectronListen('clientStatus', (data) => {
    setClientStatus(data);
  });

  useElectronListen('onChangeAppConfig', (config) => {
    appConfigStore.set(config);
  });

  useElectronListen('onLoadGameData', (data) => {
    if (data.status === 'error') {
      setIsGameDataError(true);
      gameDataStore.loaded.set(false);
      setLoadingGameData({
        percent: 0,
        file: '',
      });
    }
    if (data.status === 'downloading') {
      setLoadingGameData({
        file: data.info.currentFileDownloading,
        percent: data.info.currentPercent,
      });
    }
    if (data.status === 'complete') {
      gameDataStore.set({
        loaded: true,
        ...data.info,
      });
      setLoadingGameData({
        percent: 100,
        file: '',
      });
    }
  });

  useEffect(() => {
    client.getClientStatus().then(setClientStatus);
    appConfig.getConfig().then((config) => {
      appConfigStore.set(config);
    });
  }, []);

  useEffect(() => {
    if (!isConnected) {
      leagueClientStore.isAvailable.set(false);
      lobbyStore.resetState();
      currentSummonerStore.resetState();
      navigate('/');
    }
  }, [isConnected]);

  useEffect(() => {
    if (!gameDataLoaded && isConnected) {
      client.reloadGameData();
      client.changeShowClient(isClientOpen);
    }
  }, [gameDataLoaded, isConnected]);

  useEffect(() => {
    setMode(themeMode === 'DARK' ? 'dark' : 'light');
  }, [themeMode]);

  if (!isConnected) {
    return <LoadingLeagueClient />;
  }

  if (isGameDataError) {
    return (
      <CentralizedStack>
        <Typography>Error on downloading game data</Typography>
        <CustomButton onClick={onClickTryAgain}>Try Again!</CustomButton>
      </CentralizedStack>
    );
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

  return (
    <>
      <LeagueClientImperativeModal />
      <LeagueClientObserverEvent />
      {children}
    </>
  );
};
