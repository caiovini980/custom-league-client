import { Stack } from '@mui/material';
import { PlayerCard } from '@render/layouts/Lobby/GenericLobby/PlayerList/PlayerCard';
import { LolLobbyV2Lobby } from '@shared/typings/lol/response/lolLobbyV2Lobby';

interface PlayerListProps {
  members: LolLobbyV2Lobby['members'];
}

export const PlayerList = ({ members }: PlayerListProps) => {
  return (
    <Stack direction={'row'} columnGap={2}>
      {members.map((m) => (
        <PlayerCard key={m.summonerId} summonerId={m.summonerId} />
      ))}
    </Stack>
  );
};
