import { Divider, Stack } from '@mui/material';
import { QueueList } from '@render/layouts/Lobby/GenericLobby/QueueList';
import { Lobby } from '@render/layouts/Lobby/GenericLobby/Lobby';

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
