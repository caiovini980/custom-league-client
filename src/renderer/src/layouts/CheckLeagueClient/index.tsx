import { useLeagueClientEvent } from '@render/hooks/useLeagueClientEvent';
import { LoadingLeagueClient } from '@render/layouts/CheckLeagueClient/LoadingLeagueClient';
import {
  electronListen,
  useElectronHandle,
} from '@render/utils/electronFunction.util';
import { storeActions, useStore } from '@render/zustand/store';
import { ClientStatusResponse } from '@shared/typings/ipc-function/to-renderer/client-status.typing';
import { PropsWithChildren, useEffect } from 'react';

export const CheckLeagueClient = ({ children }: PropsWithChildren) => {
  const { client } = useElectronHandle();
  const {
    isConnected: setIsConnected,
    version: setVersion,
    locale: setLocale,
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

  const setClientStatus = (status: ClientStatusResponse) => {
    setIsConnected(status.connected);
    if (status.connected) {
      setVersion(status.info.version);
      setLocale(status.info.locale);
    }
  };

  useEffect(() => {
    const clientStatus = electronListen.clientStatus(setClientStatus);
    client.getClientStatus().then(setClientStatus);

    return () => {
      clientStatus.unsubscribe();
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
