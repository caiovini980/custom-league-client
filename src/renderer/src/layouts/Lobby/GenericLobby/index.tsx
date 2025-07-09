import { Divider, Stack } from '@mui/material';
import { Lobby } from '@render/layouts/Lobby/GenericLobby/Lobby';
import { QueueList } from '@render/layouts/Lobby/GenericLobby/QueueList';

export const GenericLobby = () => {
  return (
    <Stack
      direction={'row'}
      height={'100%'}
      width={'100%'}
      overflow={'auto'}
      position={'relative'}
    >
      <QueueList />
      <Divider orientation={'vertical'} />
      <Lobby />
    </Stack>
  );
};
