import { Stack } from '@mui/material';
import { FirstPickLabel } from '@render/layouts/Lobby/ChampSelect/TeamPlayer/FirstPickLabel';
import { TeamPlayerCardMemo } from '@render/layouts/Lobby/ChampSelect/TeamPlayer/PlayerCard';
import { TeamChampionBans } from '@render/layouts/Lobby/ChampSelect/TeamPlayer/TeamChampionBans';
import { champSelectStore } from '@render/zustand/stores/champSelectStore';

interface TeamPlayerProps {
  isEnemyTeam?: boolean;
}

export const TeamPlayer = ({ isEnemyTeam = false }: TeamPlayerProps) => {
  const team = champSelectStore.getSessionData((session) =>
    isEnemyTeam ? session.theirTeam : session.myTeam,
  );

  return (
    <Stack direction={'column'} height={'100%'}>
      <TeamChampionBans isEnemyTeam={isEnemyTeam} />
      <FirstPickLabel isEnemyTeam={isEnemyTeam} />
      {team.map((m, index) => {
        return (
          <TeamPlayerCardMemo
            key={m.cellId}
            slotId={isEnemyTeam ? index + team.length : index}
            isEnemyTeam={isEnemyTeam}
            amountPlayer={team.length}
          />
        );
      })}
    </Stack>
  );
};
