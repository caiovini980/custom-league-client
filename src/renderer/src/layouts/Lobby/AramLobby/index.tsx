import { Button, Typography } from '@mui/material';
import { useLeagueClientRequest } from '@render/hooks/useLeagueClientRequest';
import { useState } from 'react';

export const AramLobby = () => {
  const { makeRequest } = useLeagueClientRequest();

  // Variables
  const [isSearching, setIsSearching] = useState<boolean>();

  function onFindAramButtonClicked() {
    makeRequest('POST', '/lol-lobby/v2/lobby/matchmaking/search', undefined);
    setIsSearching(true);
  }

  function onStopAramMatchSearchButtonClicked() {
    makeRequest('DELETE', '/lol-lobby/v2/lobby/matchmaking/search', undefined);
    setIsSearching(false);
  }

  function onReturnMainMenuButtonClicked() {
    makeRequest('DELETE', '/lol-lobby/v2/lobby', undefined);
  }

  function HandleRendering() {
    if (isSearching) {
      return (
        <>
          <Typography> Searching for game... </Typography>
          <Button
            variant="contained"
            onClick={onStopAramMatchSearchButtonClicked}
          >
            Stop search
          </Button>
        </>
      );
    }

    return (
      <>
        <Typography>ARAM Room</Typography>
        <Button variant="contained" onClick={onFindAramButtonClicked}>
          Find Match
        </Button>

        <Button variant="contained" onClick={onReturnMainMenuButtonClicked}>
          Return to Main Menu
        </Button>
      </>
    );
  }

  return HandleRendering();
};
