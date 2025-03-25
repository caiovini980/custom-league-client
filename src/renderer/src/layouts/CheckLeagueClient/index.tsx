import {
  electronListen,
  useElectronHandle,
} from '@render/utils/electronFunction.util';
import { storeActions, useStore } from '@render/zustand/store';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const CheckLeagueClient = () => {
  const navigate = useNavigate();
  const { client } = useElectronHandle();
  const { isConnected: setIsConnected } = storeActions.leagueClient;
  const isConnected = useStore().leagueClient.isConnected();

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
    navigate(isConnected ? '/home' : '/');
  }, [isConnected]);

  return <></>;
};
