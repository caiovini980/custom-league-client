import { Stack } from '@mui/material';
import { PlayerCard } from '@render/layouts/Lobby/GenericLobby/PlayerList/PlayerCard';
import { LolLobbyV2Lobby } from '@shared/typings/lol/response/lolLobbyV2Lobby';

interface PlayerListProps {
  lobby: LolLobbyV2Lobby;
}

export const PlayerList = ({ lobby }: PlayerListProps) => {
  return (
    <Stack direction={'row'} columnGap={2}>
      {lobby.members.map((m) => (
        <PlayerCard
          key={m.summonerId}
          member={m}
          isOwner={m.summonerId === lobby.localMember.summonerId}
          showPositionSelector={lobby.gameConfig.showPositionSelector}
        />
      ))}
    </Stack>
  );
};
