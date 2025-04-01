import { useLeagueClientEvent } from '@render/hooks/useLeagueClientEvent';
import { LoadingLeagueClient } from '@render/layouts/CheckLeagueClient/LoadingLeagueClient';
import {
  electronListen,
  useElectronHandle,
} from '@render/utils/electronFunction.util';
import { storeActions, useStore } from '@render/zustand/store';
import { PropsWithChildren, useEffect } from 'react';

export const CheckLeagueClient = ({ children }: PropsWithChildren) => {
  const { client } = useElectronHandle();
  const {
    isConnected: setIsConnected,
    isAvailable: setIsAvailable,
    resetState,
  } = storeActions.leagueClient;
  const isConnected = useStore().leagueClient.isConnected();

  useLeagueClientEvent(
    '/riotclient/pre-shutdown/begin',
    () => {
      resetState();
    },
    {
      makeInitialRequest: false,
    },
  );

  useEffect(() => {
    const isClientConnectedEvent = electronListen.isClientConnected(
      (isConnected) => {
        setIsConnected(isConnected);
      },
    );

    client.getIsClientConnected().then((isConnected) => {
      setIsConnected(isConnected);
    });

    return () => {
      isClientConnectedEvent.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!isConnected) {
      setIsAvailable(false);
    }
  }, [isConnected]);

  if (!isConnected) {
    return <LoadingLeagueClient />;
  }

  return <>{children}</>;
};
