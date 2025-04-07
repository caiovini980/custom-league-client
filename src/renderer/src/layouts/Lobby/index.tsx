import { Typography } from '@mui/material';
import { CentralizedStack } from '@render/components/CentralizedStack';
import { LoadingScreen } from '@render/components/LoadingScreen';
import { useLeagueClientEvent } from '@render/hooks/useLeagueClientEvent';
import { storeActions, useStore } from '@render/zustand/store';
import { useState } from 'react';
import { MainMenu } from './MainMenu';
import { AramLobby } from './AramLobby';

export const Lobby = () => {
  // Constants
  const isAvailable = useStore().leagueClient.isAvailable();
  const { isAvailable: setIsAvailable } = storeActions.leagueClient;

  // Variables
  const [currentQueueId, setCurrentQueueId] = useState<number>();

  // Events subscriptions
  useLeagueClientEvent('/lol-gameflow/v1/availability', (data) => {
    setIsAvailable(data.isAvailable);
  });

  useLeagueClientEvent('/lol-gameflow/v1/session', (data) => {
    setCurrentQueueId(data.gameData.queue.id);
    console.log('Current Queue ID: ', data);
  });

  // Methods

  // HTML stuff
  function HandleRendering() {
    if (!isAvailable) {
      return <LoadingScreen height={'100%'} />;
    }

    switch (currentQueueId) {
      case -1: {
        return (
          <CentralizedStack>
            <MainMenu currentQueueId={currentQueueId} />
          </CentralizedStack>
        );
      }

      case 450: {
        return (
          <CentralizedStack>
            <AramLobby />
          </CentralizedStack>
        );
      }

      default: {
        return (
          <CentralizedStack>
            <Typography>Not done yet... Wait for the next patch :)</Typography>
          </CentralizedStack>
        );
      }
    }
  }

  // Running
  return HandleRendering();
};
