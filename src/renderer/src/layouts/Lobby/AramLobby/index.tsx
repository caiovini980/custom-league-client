import { Button, Typography } from '@mui/material';

export const AramLobby = () => {
  function onFindAramButtonClicked() {
    console.log('Finding ARAM game');
  }

  function onReturnMainMenuButtonClicked() {
    console.log('Returning to main menu...');
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
};
