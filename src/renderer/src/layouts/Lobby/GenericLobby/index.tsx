import { Stack, Typography } from '@mui/material';
import { CustomButton } from '@render/components/input';
import { useLeagueClientEvent } from '@render/hooks/useLeagueClientEvent';
import { useLeagueClientRequest } from '@render/hooks/useLeagueClientRequest';
import { MatchMakingStats } from '@render/layouts/Lobby/GenericLobby/MatchMakingStats';
import { PlayerList } from '@render/layouts/Lobby/GenericLobby/PlayerList';
import { Restriction } from '@render/layouts/Lobby/GenericLobby/Restriction';
import { useStore } from '@render/zustand/store';
import { LolGameflowV1Session } from '@shared/typings/lol/response/lolGameflowV1Session';
import { LolLobbyV2Lobby } from '@shared/typings/lol/response/lolLobbyV2Lobby';
import { useState } from 'react';

interface GenericLobbyProps {
  lobbySession: LolGameflowV1Session;
}

export const GenericLobby = ({ lobbySession }: GenericLobbyProps) => {
  const { makeRequest } = useLeagueClientRequest();

  const queues = useStore().gameData.queues();

  const [lobby, setLobby] = useState<LolLobbyV2Lobby>();

  function onReturnMainMenuButtonClicked() {
    makeRequest('DELETE', '/lol-lobby/v2/lobby', undefined);
  }

  useLeagueClientEvent('/lol-lobby/v2/lobby', (data) => {
    setLobby(data);
  });

  if (!lobby) return;

  const canStartActivity = () => {
    if (!lobby.localMember.allowedStartActivity) {
      return false;
    }
    return lobby.canStartActivity && !lobby.restrictions?.length;
  };

  const getQueueName = (id: number) => {
    return queues.find((q) => q.id === id)?.name;
  };

  return (
    <Stack
      direction={'column'}
      rowGap={2}
      p={1}
      alignItems={'center'}
      justifyContent={'center'}
      width={'100%'}
    >
      <Typography textAlign={'center'}>
        {getQueueName(lobbySession.gameData.queue.id)}
      </Typography>
      <PlayerList lobby={lobby} />
      <Restriction restrictions={lobby.restrictions ?? []} />
      <MatchMakingStats canStartActivity={canStartActivity()} />
      <CustomButton variant="outlined" onClick={onReturnMainMenuButtonClicked}>
        Return to Main Menu
      </CustomButton>
    </Stack>
  );
};
