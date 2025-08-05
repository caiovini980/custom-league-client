import { Stack, Typography } from '@mui/material';
import { LobbyChatGroup } from '@render/layouts/Lobby/GenericLobby/LobbyChatGroup';
import { MatchMakingStats } from '@render/layouts/Lobby/GenericLobby/MatchMakingStats';
import { OpenPartyStatus } from '@render/layouts/Lobby/GenericLobby/OpenPartyStatus';
import { PlayerList } from '@render/layouts/Lobby/GenericLobby/PlayerList';
import { Restriction } from '@render/layouts/Lobby/GenericLobby/Restriction';
import { lobbyStore } from '@render/zustand/stores/lobbyStore';

export const Lobby = () => {
  const hasLobby = lobbyStore.lobby.use((s) => !!s);
  const currentQueueName = lobbyStore.currentQueueName.use();
  const phase = lobbyStore.gameFlow.use((s) => s?.phase ?? 'None');

  if (!hasLobby || phase === 'None') return;

  return (
    <Stack
      direction={'column'}
      rowGap={2}
      p={1}
      alignItems={'center'}
      justifyContent={'center'}
      width={'100%'}
      overflow={'auto'}
    >
      <Typography textAlign={'center'}>{currentQueueName}</Typography>
      <OpenPartyStatus />
      <PlayerList />
      <Restriction />
      <MatchMakingStats />
      <LobbyChatGroup />
    </Stack>
  );
};
