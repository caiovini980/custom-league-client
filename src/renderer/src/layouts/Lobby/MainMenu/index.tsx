import { Button, Typography } from '@mui/material';
import { useElectronHandle } from '@render/utils/electronFunction.util';

interface MainMenuProps {
  currentQueueId: number;
}

export const MainMenu = (props: MainMenuProps) => {
  const { lobby } = useElectronHandle();

  function onCreateAramButtonClicked() {
    if (props.currentQueueId === -1) {
      console.log('Creating ARAM room...');
      lobby.createAram();
      return;
    }

    console.log('Couldn`t create a room for ARAM: Queue ID isn`t `0`');
  }

  function onCreateNormalGameButtonClicked() {
    if (props.currentQueueId === -1) {
      console.log('Creating Normal room...');
    }
    console.log('Couldn`t create a room for Normal game: Queue ID isn`t `0`');
  }

  return (
    <>
      <Typography>Welcome to League Client Helper</Typography>
      <Button variant="contained" onClick={onCreateAramButtonClicked}>
        Create ARAM Lobby
      </Button>
      <Button variant="contained" onClick={onCreateNormalGameButtonClicked}>
        Create Normal Game Lobby
      </Button>
    </>
  );
};
