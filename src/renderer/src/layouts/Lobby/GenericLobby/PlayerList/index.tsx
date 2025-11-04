import { Grid } from '@mui/material';
import { PlayerCard } from '@render/layouts/Lobby/GenericLobby/PlayerList/PlayerCard';
import { lobbyStore } from '@render/zustand/stores/lobbyStore';
import { isEqual } from 'lodash-es';

export const PlayerList = () => {
  const members = lobbyStore.lobby.use((s) => s?.members ?? [], isEqual);
  const summonerId = lobbyStore.lobby.use(
    (s) => s?.localMember.summonerId ?? -1,
  );
  const showPositionSelector = lobbyStore.lobby.use(
    (s) => s?.gameConfig.showPositionSelector ?? false,
  );

  const isLeader =
    members.find((m) => m.summonerId === summonerId)?.isLeader ?? false;

  return (
    <Grid container spacing={2} justifyContent={'center'}>
      {members.map((m) => (
        <Grid key={m.summonerId}>
          <PlayerCard
            member={m}
            isOwner={m.summonerId === summonerId}
            showPositionSelector={showPositionSelector}
            isLeader={isLeader}
          />
        </Grid>
      ))}
    </Grid>
  );
};
