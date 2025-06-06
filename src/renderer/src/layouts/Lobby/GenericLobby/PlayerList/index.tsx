import { Grid } from '@mui/material';
import { PlayerCard } from '@render/layouts/Lobby/GenericLobby/PlayerList/PlayerCard';
import { LolLobbyV2Lobby } from '@shared/typings/lol/response/lolLobbyV2Lobby';

interface PlayerListProps {
  lobby: LolLobbyV2Lobby;
}

export const PlayerList = ({ lobby }: PlayerListProps) => {
  const isLeader =
    lobby.members.find((m) => m.summonerId === lobby.localMember.summonerId)
      ?.isLeader ?? false;

  return (
    <Grid container spacing={2} justifyContent={'center'}>
      {lobby.members.map((m) => (
        <Grid key={m.summonerId}>
          <PlayerCard
            member={m}
            isOwner={m.summonerId === lobby.localMember.summonerId}
            showPositionSelector={lobby.gameConfig.showPositionSelector}
            isLeader={isLeader}
          />
        </Grid>
      ))}
    </Grid>
  );
};
